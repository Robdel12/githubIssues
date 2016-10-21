import React, { Component } from 'react';
import GitHubIssuesDetails from 'githubIssues/components/github-issues-details';
import {
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  View,
  AsyncStorage
} from 'react-native';
import GiftedListView from 'react-native-gifted-listview';
import _ from 'lodash';

export default class GitHubIssues extends Component {

  constructor(props) {
    super(props);

    this.state = {
      githubIssues: [],
      isLoading: true,
      loaded: false,
      currentPage: 1,
      hasLoadedAllPages: false
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('githubToken').then((token) => {
      this.setState({
        githubToken: token
      });

      this._fetchData().then((data) => {
        this.setState({
          githubIssues: data,
          isLoading: false,
          loaded: true
        });
      });
    });
  }

  _fetchData() {
    return fetch(`https://api.github.com/orgs/thefrontside/issues?filter=all&state=open&access_token=${this.state.githubToken}&per_page=30&page=${this.state.currentPage}`).then((response) => {
      return response.json();
    }).then((data) => {
      if(!data.length) {
        this.setState({
          hasLoadedAllPages: true
        });
      }
      return data;
    });
  }

  renderLoadingView() {
    return (
      <View style={MasterViewStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  loadNextPage(page = 1, callback, options) {

    if(!this.state.isLoading) {
      // +1 the current page and set the state to loading
      this.setState({
        currentPage: this.state.currentPage + 1,
        isLoading: true
      });

      // Fetch the data, then set the state with the new data
      this._fetchData().then((data) => {
        let uniqueTitle = (object1, object2) => {
          return object1.title === object2.title;
        };

        let newData = _.uniqWith(this.state.githubIssues.concat(data), uniqueTitle);

        if(this.state.hasLoadedAllPages) {
          callback(newData, { allLoaded: true });
        }

        // Add the data to GiftedListView
        callback(newData);
        this.setState({
          githubIssues: newData,
          isLoading: false,
          loaded: true
        });
      });
    }
  }

  // Renders list view row
  renderRow(issue) {
    return (
      <TouchableHighlight onPress={() => {
        this.props.navigator.push({
          title: issue.repository.name,
          component: GitHubIssuesDetails,
          passProps: { issue }
        });
       }}
       underlayColor="#ddd">
        <View style={MasterViewStyles.rowContainer}>
          <Text style={MasterViewStyles.rowTitle}>{issue.title}</Text>
          <Text>{issue.repository.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <GiftedListView
        rowView={this.renderRow.bind(this)}
        onFetch={this.loadNextPage.bind(this)}
        firstLoader={true} // display a loader for the first fetching
        pagination={true} // enable infinite scrolling using touch to load more
        refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
        withSections={false} // enable sections
        initialListSize={12} // initial size of the list
        enableEmptySections={true}
        refreshableDistance={40}
        style={MasterViewStyles.stage}
        distinctRows={(data) => {
          // Make sure there's no dupes
          let compare = (object1, object2) => {
            return object1.title === object2.title;
          };

          let newData = _.uniqWith(data, compare);

          return newData;
        }}
        customStyles={{
          paginationView: {
            backgroundColor: '#eee',
          },
        }}

        refreshableTintColor="blue"
      />
    );
  }
}

// I imagine there will be a couple style sheets.
export const MasterViewStyles = StyleSheet.create({
  stage: {
    paddingTop: 70
  },
  cell: {
    fontSize: 10
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
    borderColor: "#ddd",
    borderBottomWidth: 1,
    flexDirection: "column"
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "500",
    paddingBottom: 3
  }
});
