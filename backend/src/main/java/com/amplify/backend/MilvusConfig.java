package com.amplify.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;

@Configuration
public class MilvusConfig {

    @Value("${ZILLIZ_ENDPOINT}")
    private String zillizHost;

    @Value("${ZILLIZ_TOKEN}")
    private String zillizToken;

    @Bean
    public MilvusClientV2 milvusClient() {
        ConnectConfig connectConfig = ConnectConfig.builder()
                .uri(zillizHost)
                .token(zillizToken)
                .build();

        MilvusClientV2 milvusClient = new MilvusClientV2(connectConfig);

        return milvusClient;
    }
}
