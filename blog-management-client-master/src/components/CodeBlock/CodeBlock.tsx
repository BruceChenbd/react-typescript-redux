import * as React from 'react';
import * as highlight from 'highlight.js';

interface IProps {
  language: string;
  value: string;
}

export default class CodeBlock extends React.PureComponent<IProps, any> {
  public codeEl: any;

  public componentDidMount() {
    this.highlightCode();
  }

  public componentDidUpdate() {
    this.highlightCode();
  }

  public highlightCode() {
    highlight.highlightBlock(this.codeEl);
  }

  public render() {
    return (
      <pre>
        <code ref={(ref: any) => (this.codeEl = ref)} className={`language-${this.props.language}`}>
          {this.props.value}
        </code>
      </pre>
    );
  }
}
