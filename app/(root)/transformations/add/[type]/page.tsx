"use client"

import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';
import { redirect, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


type TransformationTypeKey = keyof typeof transformationTypes; // Extract valid keys

const AddTransformationTypePage = () => {
  const { type } = useParams();
  const { user: clerk } = useUser();
  const clerk_id = clerk?.id;

  // Ensure type is a valid key
  const transformationKey = Array.isArray(type) ? type[0] : type; // Handle string[]
  if (!transformationKey || !(transformationKey in transformationTypes)) {
    redirect('/error');
  }

  const transformation = transformationTypes[transformationKey as TransformationTypeKey];
  const [user, setUser] = useState<any | null>(null);

  if(!clerk_id) redirect('/sign-in')

  if (!transformation) redirect('/error'); // Handle invalid transformation type

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUser = await getUserById(clerk_id);
        setUser(fetchedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        redirect('/error');
      }
    };

    fetchUserData();
  }, [clerk_id]);

  if (!user) {
    return <p>Loading...</p>; // Render a loading state
  }

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