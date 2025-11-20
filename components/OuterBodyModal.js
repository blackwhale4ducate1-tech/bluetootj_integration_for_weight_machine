import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS, FONTS, FontAwesome} from '../constants';

const OuterBodyModal = ({showModal, handleClose, modalTitle, children}) => {
  return (
    <View>
      {/* Modal */}
      <Modal
        isVisible={showModal}
        onBackdropPress={handleClose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}>
        <View style={styles.modalContainer}>
          {/* Modal Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <FontAwesome name="window-close" size={20} color={COLORS.red} />
            </TouchableOpacity>
          </View>
          {/* Modal Content */}
         
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
      
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 1,
    maxHeight: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,

  },
  modalTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontFamily: FONTS.body4.fontFamily,
    fontWeight: '700',
    marginLeft:20,
    
    
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 15,
  },
});

export default OuterBodyModal;
