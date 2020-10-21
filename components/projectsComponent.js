import React, { Component } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ListItem, Tile, Icon, Card } from "react-native-elements";
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {projects: state.projects}
}

class Projects extends Component {

  static navigationOptions = {
    title: "Projects",
  };

  render() {
    const { navigate } = this.props.navigation;
    const renderProject = ({ item }) => {
      const image = item.imgSrc
      return <Tile onPress={() => navigate("Areas", {projectId: item._id})} featured title={item.name} caption={`${item.county} county, ${item.state}`} imageSrc={require('./images/balconySinks.jpg')} />;
    };

    // render() {
    //   const { navigate } = this.props.navigation;
    //   const renderProject = ({ item }) => {
    //     {console.log(item.imgSrc)}
    //     const image = item.imgSrc
    //     return <Tile onPress={() => navigate("Inventory", { projectId: item.id })} featured title={item.name} caption={`${item.county} county, ${item.state}`} imageSrc={require('./images/balconySinks.jpg')} />;
    //   };

    const RenderContent = ({projects}) => {
      if (!projects) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't created any projects yet!</Text>
              <Text></Text>
              <Text style={styles.textInCard}>Click the '+' button to get started!</Text>
            </Card>
          </View>
        );
    } else {
      return <FlatList data={projects} renderItem={renderProject} keyExtractor={(item) => item._id.toString()} />
    }
  }

    return (
      <View style={{ flex: 1 }}>
        <RenderContent projects={this.props.projects.projects}/>
        <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('Create Project')}>
          <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
  },
  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },
  textInCard: {
    top: 30,
    fontSize: 20,
    alignContent: "center",
    textAlign: "center",
    color: "dimgray",
  },
  emptyScreenCard: {
    width: "60%",
    height: 250,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 10,
  },
});

export default connect(mapStateToProps)(Projects);
