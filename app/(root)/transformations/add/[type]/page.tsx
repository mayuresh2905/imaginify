"use client"

import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const AddTransformationTypePage = async ({params: { type } }: SearchParamProps) => {
  const { user: clerk } = useUser();
  const clerk_id = clerk?.id;
  const transformation = transformationTypes[type];

  if(!clerk_id) redirect('/sign-in')

  const user = await getUserById(clerk_id);

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <TransformationForm 
        action="Add" 
        userId={ user._id }
        type={transformation.type as TransformationTypeKey}
        creditBalance={user.creditBalance}
      />
    </>
    
  )
}

export default AddTransformationTypePage;