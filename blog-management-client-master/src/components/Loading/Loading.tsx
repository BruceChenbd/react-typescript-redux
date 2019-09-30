import * as React from 'react';
import { Spin } from 'antd';

import './Loading.less';

export default function Loading() {
  return (
    <div className="loading-page">
      <Spin tip="Loading..." />
    </div>
  );
}
