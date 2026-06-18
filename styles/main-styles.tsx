import { StyleSheet } from 'react-native';

export const MAIN_COLORS = {
  primaryOrange: '#f05524',
  primaryBlue: '#0A1936',
  primaryWhite: '#ffffff',
  background: '#f5f5f5',
  textDark: '#333333',
  border: '#e0e0e0',
};

const mainStyles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    padding: 20,
    backgroundColor: MAIN_COLORS.primaryOrange,
  },
  card: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: MAIN_COLORS.primaryWhite,
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    color: MAIN_COLORS.primaryBlue,
    fontWeight: '600',
  },
  buttonPrimary: {
    backgroundColor: MAIN_COLORS.primaryOrange,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonPrimaryText: {
    color: MAIN_COLORS.primaryWhite,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: MAIN_COLORS.border,
    borderRadius: 4,
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default mainStyles;
