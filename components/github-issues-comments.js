import React, { Component } from 'react';
import { Styles } from 'githubIssues/components/github-issues-details';
import { Text, View, Image } from 'react-native';

export default class GitHubIssuesComments extends Component {

  constructor(props) {
    super(props);

    this.issue = props.issue;
    this.state = {
      commentsList: [],
      commentsLoaded: false
    };
  }

  fetchComments() {
    fetch(this.issue.comments_url)
    .then(response => response.json())
    .then((data) => {
      // Because they don't return an empty array... (shrug)
      if(data.message === "Not Found") {
        this.setState({
          hasNoComments: true
        });
      }

      this.setState({
        commentsList: data,
        commentsLoaded: true
      });
    });
  }

  componentWillMount() {
    this.fetchComments();
  }

  render() {
    if(!this.state.commentsLoaded) {
      return (<Text>Loading comments...</Text>);
    }

    if(this.state.hasNoComments) {
      return (
        <Text>No comments</Text>
      );
    }

    return (
      <View>
        {this.state.commentsList.map((comment) => {
          return (
            <View key={comment.id} style={{padding: 20, borderBottomWidth: 1, borderColor: "#ddd" }}>
              <View style={[Styles.col8, {marginBottom: 10}]}>
                <View style={Styles.avatarContainer}>
                  <Image source={{uri: comment.user.avatar_url}} style={Styles.avatar} />
                </View>
                <Text style={Styles.userName}>{comment.user.login}</Text>
              </View>
              <Text>{comment.body}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}
