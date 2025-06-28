import { getCurrentUser } from '@/lib/actions/authaction'
import Agent from '../../components/Agent'
import React from 'react'
import { redirect } from 'next/navigation'

const page = async () => {
  const user = await getCurrentUser();
  if (!user?.id || !user?.name) redirect('/sing-in');

  return (
    <>
      <h3 className="mb-8">Interview Generation</h3>
      <Agent userName={user.name} userId={user.id} type="generate" />
    </>
  )
}
export default page
