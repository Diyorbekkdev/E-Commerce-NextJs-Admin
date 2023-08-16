import { Progress, Space } from 'antd'
import React from 'react'

const Dashboard = () => {
  return (
    <div>
      <Space wrap>
        <Progress type="circle" percent={75} />
        <Progress type="circle" percent={70} status="exception" />
        <Progress type="circle" percent={100} />
      </Space>
    <>
    <h1>Products Managing</h1>
    <Progress percent={30} />
    <Progress percent={50} status="active" />
    <Progress percent={70} status="exception" />
    <Progress percent={100} />
    <Progress percent={50} showInfo={false} />
  </>
    </div>
  )
}

export default Dashboard
