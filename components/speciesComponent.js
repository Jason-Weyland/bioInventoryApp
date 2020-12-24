import React, { useState, useLayoutEffect, useContext } from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity, Modal, Alert} from 'react-native';
import { ListItem, Icon, Input, Button } from "react-native-elements";
import {connect} from 'react-redux';
import Swipeout from 'react-native-swipeout';
import ImgPicker from './imagePickerComponent';
import {updateSpecies, deleteSpeciesFromMaster} from '../redux/actionCreators/species';
import RoundButton from './customStyledComponents/roundedButtonComponent';
import FormInput from './customStyledComponents/formInputComponent';
import {UserContext} from './userContextComponent';

const mapStateToProps = state => {
  return {species: state.species}
}

const mapDispatchToProps = {
  updateSpecies,
  deleteSpeciesFromMaster
}

const SpeciesList = props => {
  const [isModalOpen, setModal] = useState(false);
  const [modalIndex, setModalIndex] = useState('')
  const [sciName, setSciName] = useState('');
  const [comName, setComName] = useState('');
  const [rank, setRank] = useState('')
  const [selectedImage, setSelectedImage] = useState('');
  const [specimen, setSpecimen] = useState([])
  const {navigate} = props.navigation
  const speciesAlpha = props.species.species.sort((a, b) => (a.comName.toUpperCase() > b.comName.toUpperCase()) ? 1 : -1)
  const {value} = useContext(UserContext)
  const [user, setUser] = value

  useLayoutEffect(() => {
    if (modalIndex) {
      setSpeciesState()
    }
  }, [modalIndex]);

  const setSpeciesState = () => {
    const findSpecies = props.species.species.find(species => species._id.toString() === modalIndex.toString())
    setSpecimen(findSpecies);
    setSciName(findSpecies.sciName);
    setComName(findSpecies.comName);
    findSpecies.rank ? setRank(findSpecies.rank) : setRank('Unknown')
    setSelectedImage(findSpecies.img);
    setModal(!isModalOpen);
  }

  const showModal = () => {
    setModal(!isModalOpen);
    setModalIndex('');
  };

  const handleSubmit = () => {
    props.updateSpecies(modalIndex, sciName, comName, rank, selectedImage, specimen);
    setModal(!isModalOpen)
    setModalIndex('')
  }

  const imagePickedHandler = imagePath => {
    setSelectedImage(imagePath)
  }

  const renderSpecies = ({item}) => {
    const leftButton = [
      {
        text: "Edit",
        backgroundColor: "#008b8b",
        textSize: 100,
        onPress: () => setModalIndex(item._id)
      },
    ];

    const rightButton = [
      {
        text: "Delete",
        backgroundColor: 'red',
        onPress: () => {
          Alert.alert(
            'Do you want to delete this project?',
            `${item.comName} \n${item.sciName}`,
            [
              {
                text: 'Cancel',
                type: 'cancel'
              },
              {
                text: 'Confirm',
                onPress: () => props.deleteSpeciesFromMaster(item)
              }
          ],
          {cancelable: false}
          )
        }
      }
    ]
    return (
      <Swipeout left={leftButton} right={rightButton} autoClose={true}>
        <View>
          <ListItem 
            title={item.comName} 
            subtitle={item.sciName}
            leftAvatar={{source: {uri: item.img}, size: 'medium'}}
            bottomDivider
            topDivider
            rightIcon={<Icon name='angle-right' type='font-awesome'/>}
            onPress={() => navigate('MasterSpeciesInfo', {specimen: item})}
          />
        </View>
      </Swipeout>
    )
  }

  const FlatSpeciesList = ({speciesAlpha}) => {
    return <FlatList data={speciesAlpha} renderItem={renderSpecies} keyExtractor={(item) => item._id.toString()}/>
  }
  return (
    <View style={{flex: 1}}>
      <FlatSpeciesList speciesAlpha={speciesAlpha}/>
      <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={() => navigate('CreateSpecies')}>
        <Icon name={"plus"} type={"font-awesome"} raised reverse color="#00ced1" style={styles.FloatingButtonStyle} />
      </TouchableOpacity>
      <Modal animationType='fade' transparent={false} visible={isModalOpen} onRequestClose={() => showModal()}>
        <View style={{margin: 10}}>
          <FormInput 
            iconName='angle-right'
            value={comName}
            onChangeText={text => setComName(text)}
          />
          <FormInput 
            iconName='angle-right'
            value={sciName}
            onChangeText={text => setSciName(text)}
          />
          <FormInput 
            iconName='angle-right'
            value={rank}
            onChangeText={text => setRank(text)}
          />
          <ImgPicker onImageTaken={imagePickedHandler} updateImage={selectedImage} />
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <RoundButton title='Update Species' onPress={() => handleSubmit()} />
          </View>
          <View style={{ margin: 10, alignItems: 'center' }}>
            <RoundButton title='Cancel' style={{backgroundColor: 'firebrick'}} onPress={() => showModal()} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

SpeciesList.navigationOptions = {
  title: 'Species List'
}


export default connect(mapStateToProps, mapDispatchToProps)(SpeciesList);

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
  margin: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});