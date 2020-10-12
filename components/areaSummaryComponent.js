import React, { Component } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { ListItem, Card } from "react-native-elements";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    trips: state.trips,
    species: state.species,
  };
};

class AreaSummary extends Component {
  static navigationOptions = {
    title: "Area Summary",
  };

  render() {
    const areaId = this.props.navigation.getParam("areaId");
    const trips = this.props.trips.trips.filter((trips) => trips.areaId === areaId);
    const species = this.props.species.species;
    const speciesArr = []

    const speciesFil = species.forEach((s) => {
      trips.forEach((trip) => {
        console.log("you are here");
        console.log(`s.tripArr: ${s.tripArr}`);
        console.log(`trip._id: ${trip.tripRef}`);
        s.tripArr.forEach((t) => {
          console.log(`t._id: ${t._id}`)
          if (t.tripRef === trip._id) {
            console.log("enter if block");
            console.log(s);
            speciesArr.push(s)
          }
        });
      });
    });
    console.log(speciesArr)

    const speciesList = ({ item }) => {
      // add species photo
      return <ListItem title={item.comName} subtitle={item.sciName} />;
    };

    const RenderSpecies = ({ speciesArr }) => {
      if (speciesArr.length === 0) {
        return (
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
            <Card containerStyle={styles.emptyScreenCard} dividerStyle={{ display: "none" }}>
              <Text style={styles.textInCard}>You haven't found any species in this area yet!</Text>
            </Card>
          </View>
        );
      } else {
        return <FlatList data={speciesArr} renderItem={speciesList} keyExtractor={(item) => item._id.toString()} />;
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <RenderSpecies speciesArr={speciesArr} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInCard: {
    top: 30,
    fontSize: 20,
    alignContent: "center",
    textAlign: "center",
    color: "dimgray",
  },
  emptyScreenCard: {
    width: "60%",
    height: 150,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 10,
  },
});

export default connect(mapStateToProps)(AreaSummary);
