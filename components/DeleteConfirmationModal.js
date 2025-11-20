import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import OuterBodyModal from './OuterBodyModal';
import {COLORS, FONTS} from '../constants';

const DeleteConfirmationModal = ({
  showModal,
  handleClose,
  handleSubmitAlert,
}) => {
  return (
    <OuterBodyModal
      showModal={showModal}
      handleClose={handleClose}
      modalTitle="Alert">
      <View style={styles.contentContainer}>
        <Text style={styles.confirmText}>Confirm Delete ?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmitAlert('Yes')}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: COLORS.red}]}
            onPress={() => handleSubmitAlert('No')}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OuterBodyModal>
  );
};

export default DeleteConfirmationModal;

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    marginVertical:20
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily:FONTS.body4.fontFamily,
    color:COLORS.black
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
