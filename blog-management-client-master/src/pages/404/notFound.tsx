import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Card } from 'antd';


interface IProps extends RouteComponentProps {}

class notFound extends React.Component<IProps, any> {
  public unMount: boolean = false;

  public componentWillUnmount() {
    this.unMount = true;
  }

  public render() {
    return (
      <Card className="blog-creation-component">
          404
      </Card>
    );
  }
}

export default withRouter(notFound);
