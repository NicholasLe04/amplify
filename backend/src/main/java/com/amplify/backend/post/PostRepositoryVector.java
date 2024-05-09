package com.amplify.backend.post;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONObject;

import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.HasCollectionReq;
import io.milvus.v2.service.index.request.CreateIndexReq;
import io.milvus.v2.service.vector.request.GetReq;
import io.milvus.v2.service.vector.request.InsertReq;
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.response.GetResp;
import io.milvus.v2.service.vector.response.SearchResp;

@Repository
public class PostRepositoryVector {

    private final MilvusClientV2 milvusClient;

    @Autowired
    public PostRepositoryVector(MilvusClientV2 milvusClient) {
        this.milvusClient = milvusClient;
        if (!milvusClient.hasCollection(HasCollectionReq.builder()
                .collectionName("posts")
                .build())) {
            createPostCollection();
        }
        createIndex();
    }

    public void createPostCollection() {
        CreateCollectionReq.CollectionSchema postCollection = milvusClient.createSchema();
        postCollection.addField(AddFieldReq.builder()
                .fieldName("id")
                .dataType(DataType.Int64)
                .isPrimaryKey(true)
                .build());
        postCollection.addField(AddFieldReq.builder()
                .fieldName("features")
                .dataType(DataType.FloatVector)
                .dimension(9)
                .build());

        milvusClient.createCollection(CreateCollectionReq.builder()
                .collectionName("posts")
                .collectionSchema(postCollection)
                .build());
    }

    public void createIndex() {
        IndexParam indexParam = IndexParam.builder()
                .metricType(IndexParam.MetricType.L2)
                .indexType(IndexParam.IndexType.IVF_SQ8)
                .fieldName("features")
                .build();

        milvusClient.createIndex(CreateIndexReq.builder()
                .collectionName("posts")
                .indexParams(Collections.singletonList(indexParam))
                .build());
    }

    public void save(Long id, List<Float> vector) {
        // save post to milvus
        List<JSONObject> data = new ArrayList<>();
        JSONObject post = new JSONObject();
        post.put("id", id);
        post.put("features", vector);
        data.add(post);

        milvusClient.insert(InsertReq.builder()
                .collectionName("posts")
                .data(data)
                .build());
    }

    public List<Long> findByVector(List<Float> vector) {
        // search milvus for similar vectors
        SearchResp res = milvusClient.search(SearchReq.builder()
                .collectionName("posts")
                .data(Collections.singletonList(vector))
                .topK(1)
                .build());
        ArrayList<Long> postIds = new ArrayList<>();
        for (SearchResp.SearchResult post : res.getSearchResults().get(0)) {
            postIds.add((long) post.getId());
        }
        return postIds;
    }

    public List<Float> findByEmail(String email) {
        GetResp res = milvusClient.get(GetReq.builder()
                .collectionName("posts")
                .ids(Collections.singletonList(email))
                .build());
        return (List<Float>) res.getGetResults().get(0).getEntity().get("features");
    }

}
