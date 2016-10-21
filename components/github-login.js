import React, { Component } from 'react';
import {
  Linking,
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  AsyncStorage,
  WebView
} from 'react-native';
import QS from 'shitty-qs';
import GitHubIssues from 'githubIssues/components/github-issues';
import { GITHUB_CLIENT_ID, GITHUB_SECRET } from 'githubIssues/env.js';

const getAccessToken = function(code) {
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: code,
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_SECRET
    })
  }).then(response => response.json()).then((data) => {
    return data.access_token;
  }).catch((error) => {
    console.log('error = ', error);
  });
};

export default class GithubLogin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hasToken: false,
      isLoading: true,
      isLoggedIn: false,
      isLoggingIn: false,
      accessCode: null
    };
  }

  componentWillMount() {
    //  DEBUGGING (resets your login)
    // AsyncStorage.removeItem('githubToken');
    //
    AsyncStorage.getItem('githubToken').then((token) => {
      this.setState({
        isLoading: false
      });
      if(token) {
        this.setState({
          githubToken: token,
          hasToken: true,
          isLoggedIn: true,
          isLoggingIn: false
        });
      }
    });
  }

  componentDidUpdate() {
    if(this.state.hasToken) {
      this.props.navigator.replace({
        title: "GitHub Issues",
        component: GitHubIssues
      });
    } else if(this.state.accessCode) {
      this.fetchAccessToken();
    }
  }

  githubAuth() {
    this.setState({
      url: [
        'https://github.com/login/oauth/authorize',
        `?client_id=${GITHUB_CLIENT_ID}`,
        '&scope=user%20repo',
        '&state=antiestablishmentarianism'
      ].join(''),
      isLoggingIn: true
    });
  }

  handleURL(event) {
    let oauthCodeMatch = event.url.match(/\?(.*)/);
    if(oauthCodeMatch) {
      var code = QS(oauthCodeMatch[0]).code;
      if(!code) {return}
      this.refs.webview.stopLoading();

      this.setState({
        accessCode: code
      });
    }
  }

  fetchAccessToken() {
    getAccessToken(this.state.accessCode).then((access_token) => {
      AsyncStorage.setItem('githubToken', access_token).then((done) =>{
        this.setState({
          githubToken: access_token,
          isLoggedIn: true,
          isLoggingIn: false,
          hasToken: true
        });
      }).catch((error) => {
        debugger
      });
    });
  }

  githubWebLogin() {
    return (
      <WebView
        ref={'webview'}
        source={{uri: this.state.url}}
        automaticallyAdjustContentInsets={false}
        onNavigationStateChange={this.handleURL.bind(this)}
        startInLoadingState={true}
        scalesPageToFit={true} />
    );
  }

  render() {
    if(this.state.isLoading) {
      return (
        <View style={Styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if(this.state.isLoggingIn) {
      return this.githubWebLogin();
    }

    return (
      <View style={Styles.container}>
        <TouchableHighlight onPress={this.githubAuth.bind(this)} style={Styles.loginBtn}>
          <Text>Login to Github</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

// I imagine there will be a couple style sheets.
const Styles = StyleSheet.create({
  loginBtn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ddd"
  },
  container: {
    flex: 1,
    //Center it horizontally
    alignSelf: "center",
    //Center it vertically
    justifyContent: "center"
  }
});
