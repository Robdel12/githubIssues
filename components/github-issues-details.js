import React, { Component } from 'react';
import GitHubIssuesComments from 'githubIssues/components/github-issues-comments';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image
} from 'react-native';
import TimeAgo from 'react-native-timeago';

export default class GitHubIssuesDetails extends Component {
  constructor(props) {
    super(props);

    this.issue = this.props.issue;
    this.user = this.props.issue.user;
  }

  milestone() {
    if(this.issue.milestone) {
      return (
        <Text style={Styles.milestone}>
          {this.issue.milestone.title}
        </Text>
      );
    }
  }

  render() {
    return (
      <ScrollView style={{backgroundColor: "#FBFBFB"}}>
        <View style={Styles.container}>
          <View style={Styles.headerContainer}>
            <View style={Styles.col8}>
              <View style={Styles.avatarContainer}>
                <Image source={{uri: this.user.avatar_url}} style={Styles.avatar} />
              </View>
              <Text style={Styles.userName}>{this.user.login}</Text>
            </View>
            <View style={Styles.issueDetialsContainer}>
              {/* Issues status */}
              <Text style={Styles.issueStatusContainer}>
                {this.issue.state}
              </Text>
              {  /* Issue # */}
              <Text>#{this.issue.number}</Text>
            </View>
          </View>
          <Text style={Styles.title}>{this.issue.title}</Text>
          <View style={Styles.labelsContainer}>
            {this.issue.labels.map((label) => {
              return (
                <Text key={label.color} style={[Styles.label, {backgroundColor: `#${label.color}`}]}>
                  {label.name}
                </Text>
              );
            })}
          </View>

          <Text style={Styles.body}>{this.issue.body}</Text>
        </View>
        <View style={Styles.footer}>
          <Text style={Styles.footerDate}>
            <TimeAgo time={this.issue.created_at} />
          </Text>
          <View style={Styles.milestoneContainer}>
            {this.milestone()}
          </View>
        </View>

        <GitHubIssuesComments issue={this.issue} />
      </ScrollView>
    );
  }

}

export var Styles = StyleSheet.create({
  container: {
    padding: 20
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 20
  },
  issueDetialsContainer: {
    flex: 4,
    flexDirection: "column",
    alignItems: "flex-end"
  },
  col8: {
    flex: 8,
    flexDirection: "row"
  },
  col5: {
    flex: 5,
    flexDirection: "row"
  },
  //assumes open
  issueStatusContainer: {
    backgroundColor: "green",
    padding: 4,
    borderRadius: 2,
    color: "white",
    marginBottom: 4
  },
  avatarContainer: {
    width: 50
  },
  avatar: {
    height: 50,
    borderRadius: 25
  },
  userName: {
    flex: 11,
    marginLeft: 10,
    alignSelf: "center"
  },
  title: {
    fontSize: 18,
    marginBottom: 20
  },
  labelsContainer: {
    flexDirection: "row",
    marginBottom: 20
  },
  label: {
    flex: 2,
    padding: 4,
    marginRight: 8
  },
  body: {
    lineHeight: 20
  },
  footer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row"
  },
  footerDate: {
    flex: 6
  },
  milestoneContainer: {
    flex: 6,
    alignItems: "flex-end"
  }
})
