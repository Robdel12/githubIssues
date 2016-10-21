/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import GithubLogin from 'githubIssues/components/github-login';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native';

export default class githubIssues extends Component {
  render() {
    return (
        <NavigatorIOS
      style={styles.container}
      initialRoute={{
        title: 'Github Login',
        component: GithubLogin
      }} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch"
  }
});

AppRegistry.registerComponent('githubIssues', () => githubIssues);
