import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {COLORS, FONTS} from '../../constants';
import {useAuth} from '../../components/AuthContext';

const screenWidth = Dimensions.get('window').width;

const NavigationCards = ({cards, goToScreen}) => {
  const {permissions} = useAuth();

  const filteredCards = cards.filter(card => {
    const permission = Array.isArray(permissions)
      ? permissions.find(p => p.page === card.permissionsPageName)
      : null;
    return permission && permission.view === 1;
  });

  return (
    <View style={styles.scrollViewContainer}>
      {filteredCards.map(card => (
        <TouchableOpacity
          key={card.id}
          style={styles.navCard}
          onPress={
            card.navigateTo ? () => goToScreen(card.navigateTo) : undefined
          }>
          {card.icon}
          <View style={{width:100}}>
          <Text
            style={[
              styles.navText,
              {color: COLORS.black, ...FONTS.body4, fontWeight: 700},
            ]}>
            {card.name}
          </Text>
          </View>
       
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 40,
  },
  navCard: {
    backgroundColor: COLORS.white,
    width: screenWidth * 0.4,
    height: 150,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navText: {
    textTransform: 'capitalize',
    letterSpacing: 0.2,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default NavigationCards;
