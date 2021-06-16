import React from 'react';

export class TaskCard extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.task._id === nextProps.task._id);
  }

  render() {
    const { task } = this.props;

    return (
      <div className="px-3 py-2 mb-3 bg-white rounded-md" key={task.id}>
        <p>{task.title}</p>
      </div>
    )
  }
};
