import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { GrAdd, GrHomeRounded, GrSearch, GrUser } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import MobileCreatePostForm from './MobileCreatePostForm';

export default function MobileFooter() {

    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    const methods = useForm()

    return (
        <>
            <FormProvider {...methods}>
                {showCreatePostForm ? <MobileCreatePostForm setShowCreatePostForm={setShowCreatePostForm} /> : null}
            </FormProvider>
            <div className='w-full h-14 flex justify-between border-t-2 border-space-lighter'>
                <Link className='flex-1 m-auto' to='/'>
                    <GrHomeRounded className='m-auto' />
                </Link>
                <button className='flex-1'>
                    <GrSearch className='m-auto' />
                </button>
                <button className='flex-1' onClick={() => { setShowCreatePostForm(true) }}>
                    <GrAdd className='m-auto' />
                </button>
                <Link className='flex-1 m-auto' to={`/profile/${localStorage.getItem('user_id')}`}>
                    <GrUser className='m-auto' />
                </Link>
            </div>
        </>
    )
}