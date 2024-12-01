import { Skeleton } from 'antd'
import React from 'react'

function OrderSummarySkeleton() {
  return (
    <div className='pt-4'>
        <Skeleton active={true} />
    </div>
  )
}

export default OrderSummarySkeleton