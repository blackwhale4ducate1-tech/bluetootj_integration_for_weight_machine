# 📱 Bluetooth Weight Scale - React Native Frontend

A complete React Native frontend application for the Bluetooth Weight Scale tracker with real-time Bluetooth connectivity, weight measurement tracking, and comprehensive health analytics.

## 🚀 Features

- **🔐 Authentication**: JWT-based login/register with secure token management
- **📱 Bluetooth Integration**: Connect to weight scales via BLE
- **⚖️ Real-time Measurements**: Live weight data from connected scales
- **📊 Health Analytics**: BMI calculation, weight trends, and statistics
- **📈 Interactive Charts**: Visual weight progress tracking
- **💾 Offline Support**: Cached data with automatic sync
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations
- **🔔 Smart Notifications**: Reminders and achievement alerts

## 📋 Tech Stack

- **Framework**: React Native 0.73.6
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **State Management**: React Context API + AsyncStorage
- **Bluetooth**: react-native-ble-plx
- **HTTP Client**: Axios with interceptors
- **Charts**: react-native-chart-kit
- **Date Handling**: date-fns
- **Icons**: react-native-vector-icons
- **Storage**: @react-native-async-storage/async-storage

## 📁 Project Structure

```
src/
├── api/                    # API configuration and endpoints
│   ├── axiosConfig.js      # Axios setup with interceptors
│   ├── authApi.js          # Authentication API calls
│   └── weightApi.js        # Weight measurement API calls
│
├── components/             # Reusable UI components
│   ├── common/             # Generic components
│   │   ├── Button.js       # Custom button with variants
│   │   ├── Input.js        # Text input with validation
│   │   ├── Card.js         # Container component
│   │   ├── Loading.js      # Loading states & skeletons
│   │   └── ErrorMessage.js # Error handling components
│   │
│   ├── bluetooth/          # Bluetooth-specific components
│   ├── weight/             # Weight measurement components
│   └── profile/            # Profile-related components
│
├── context/                # React Context providers
│   ├── AuthContext.js      # Authentication state
│   ├── BluetoothContext.js # Bluetooth connection state
│   └── WeightContext.js    # Weight data management
│
├── navigation/             # Navigation structure
│   ├── AppNavigator.js     # Root navigator
│   ├── AuthNavigator.js    # Authentication flow
│   ├── MainNavigator.js    # Main app tabs
│   └── WeightNavigator.js  # Weight measurement stack
│
├── screens/                # Screen components
│   ├── auth/               # Authentication screens
│   │   ├── SplashScreen.js # App loading screen
│   │   ├── LoginScreen.js  # User login
│   │   └── RegisterScreen.js # User registration
│   │
│   ├── weight/             # Weight-related screens
│   │   ├── HomeScreen.js   # Dashboard
│   │   ├── ConnectScaleScreen.js # Bluetooth connection
│   │   ├── MeasureScreen.js # Active measurement
│   │   ├── HistoryScreen.js # Weight history
│   │   └── StatsScreen.js  # Statistics & charts
│   │
│   └── profile/            # Profile screens
│       └── ProfileScreen.js # User profile
│
├── services/               # Business logic services
│   ├── BluetoothService.js # BLE operations
│   └── StorageService.js   # AsyncStorage management
│
├── theme/                  # Design system
│   ├── colors.js           # Color palette
│   ├── fonts.js            # Typography
│   └── spacing.js          # Layout & spacing
│
└── utils/                  # Utility functions
    ├── constants.js        # App constants
    └── helpers.js          # Helper functions
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- React Native CLI
- Android Studio / Xcode
- Physical device or emulator

### 1. Install Dependencies

```bash
# Install npm packages
npm install

# iOS only - install pods
cd ios && pod install && cd ..
```

### 2. Configure Backend Connection

Update the API base URL in `src/utils/constants.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_LOCAL_IP:3001/api', // Replace with your backend IP
  TIMEOUT: 10000,
};
```

### 3. Android Permissions

The app automatically requests these permissions:
- `ACCESS_FINE_LOCATION` - Required for Bluetooth scanning
- `BLUETOOTH_SCAN` - Android 12+ Bluetooth scanning
- `BLUETOOTH_CONNECT` - Android 12+ Bluetooth connection

### 4. Run the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📱 App Flow

### Authentication Flow
1. **Splash Screen** - App initialization and auth check
2. **Login/Register** - User authentication
3. **Main App** - Authenticated user experience

### Main App Structure
- **Home Tab** - Dashboard with latest measurements
- **Weight Tab** - Bluetooth connection and measurement
- **Stats Tab** - Charts and analytics
- **Profile Tab** - User settings and profile

### Weight Measurement Flow
1. **Connect Scale** - Scan and connect to Bluetooth scale
2. **Measure** - Real-time weight reading
3. **Save** - Store measurement with optional notes
4. **History** - View past measurements

## 🔧 Configuration

### API Configuration (`src/utils/constants.js`)

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:3001/api', // Your backend URL
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};
```

### Bluetooth Configuration

```javascript
export const BLUETOOTH_CONFIG = {
  SCAN_TIMEOUT: 10000,
  CONNECTION_TIMEOUT: 15000,
  WEIGHT_SERVICE_UUID: '0000181D-0000-1000-8000-00805F9B34FB',
  WEIGHT_MEASUREMENT_UUID: '00002A9D-0000-1000-8000-00805F9B34FB',
};
```

### Theme Customization

Colors, fonts, and spacing can be customized in the `src/theme/` directory:

```javascript
// src/theme/colors.js
export const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  // ... more colors
};
```

## 🎨 UI Components

### Common Components

- **Button** - Multiple variants (primary, secondary, outline, ghost)
- **Input** - Text input with validation and icons
- **Card** - Container with shadow and variants
- **Loading** - Spinner, skeleton loaders, and loading states
- **ErrorMessage** - Consistent error display with retry options

### Usage Examples

```jsx
// Button with loading state
<Button
  title="Connect Scale"
  onPress={handleConnect}
  loading={isConnecting}
  variant="primary"
  fullWidth
  icon={<Text>📱</Text>}
/>

// Input with validation
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
  leftIcon={<Text>📧</Text>}
/>

// Card container
<Card variant="elevated" onPress={handlePress}>
  <Text>Card content</Text>
</Card>
```

## 📊 State Management

### Context Providers

#### AuthContext
- User authentication state
- Login/logout functionality
- Profile management
- Token handling

```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

#### BluetoothContext
- Device scanning and connection
- Real-time weight data
- Connection status
- Error handling

```jsx
const { 
  devices, 
  connectedDevice, 
  currentWeight, 
  startScan, 
  connectToDevice 
} = useBluetooth();
```

#### WeightContext
- Measurement history
- Statistics calculation
- Data synchronization
- Offline caching

```jsx
const { 
  measurements, 
  latestMeasurement, 
  saveMeasurement, 
  fetchStatistics 
} = useWeight();
```

## 🔗 API Integration

### Authentication

```javascript
// Login
const result = await login(email, password);
if (result.success) {
  // Navigate to main app
}

// Register
const result = await register(userData);
```

### Weight Measurements

```javascript
// Save measurement
const result = await saveMeasurement({
  weight: 75.5,
  unit: 'kg',
  bodyFat: 18.5,
  notes: 'Morning measurement'
});

// Get statistics
const stats = await fetchStatistics({
  period: 'month'
});
```

## 📱 Bluetooth Integration

### Device Connection

```javascript
// Start scanning
await startScan();

// Connect to device
await connectToDevice(deviceId);

// Listen for weight data
useEffect(() => {
  if (currentWeight) {
    // Handle new weight measurement
    console.log('New weight:', currentWeight);
  }
}, [currentWeight]);
```

### Weight Data Parsing

The app automatically parses Bluetooth weight data according to the Weight Scale Profile specification:

- Weight value (kg/lbs)
- BMI calculation
- Body composition (if supported)
- Timestamp

## 📈 Charts & Analytics

### Weight Progress Chart

```jsx
import { LineChart } from 'react-native-chart-kit';

const chartData = prepareChartData(measurements, '1m');

<LineChart
  data={chartData}
  width={screenWidth}
  height={220}
  chartConfig={chartConfig}
  bezier
/>
```

### Statistics Display

- Current, average, min, max weight
- BMI trends and categories
- Weight change over periods
- Goal progress tracking

## 🔄 Offline Support

### Data Caching

- Measurements cached locally
- Automatic sync when online
- Offline-first approach
- Background sync

### Storage Management

```javascript
// Cache measurements
await StorageService.saveCachedMeasurements(measurements);

// Get cached data
const cached = await StorageService.getCachedMeasurements();
```

## 🚨 Error Handling

### Network Errors
- Automatic retry with exponential backoff
- Offline mode detection
- User-friendly error messages

### Bluetooth Errors
- Permission handling
- Connection failure recovery
- Device compatibility checks

### Validation Errors
- Real-time form validation
- Field-specific error messages
- Input sanitization

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Bluetooth device scanning
- [ ] Scale connection and measurement
- [ ] Data synchronization
- [ ] Offline functionality
- [ ] Chart rendering
- [ ] Navigation flows

### Test Data

Use the backend seeder to create test data:

```bash
# In backend directory
npm run seed
```

## 🔧 Troubleshooting

### Common Issues

#### Bluetooth Not Working
- Check device permissions
- Ensure Bluetooth is enabled
- Verify location services (Android)
- Test with physical device (not emulator)

#### API Connection Failed
- Verify backend is running
- Check IP address in constants.js
- Ensure devices are on same network
- Check firewall settings

#### Build Errors
- Clear Metro cache: `npx react-native start --reset-cache`
- Clean build: `cd android && ./gradlew clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Debug Mode

Enable debug logging by setting `__DEV__` flag:

```javascript
if (__DEV__) {
  console.log('Debug info:', data);
}
```

## 📱 Platform-Specific Notes

### Android
- Requires location permission for Bluetooth scanning
- Target SDK 33+ requires new Bluetooth permissions
- Test on physical device for Bluetooth functionality

### iOS
- Bluetooth permissions handled automatically
- Requires iOS 10+ for BLE support
- Test on physical device for accurate results

## 🚀 Deployment

### Android Release Build

```bash
# Generate release APK
cd android
./gradlew assembleRelease

# Generate AAB for Play Store
./gradlew bundleRelease
```

### iOS Release Build

```bash
# Archive for App Store
npx react-native run-ios --configuration Release
```

## 🔄 Updates & Maintenance

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update React Native
npx react-native upgrade
```

### Backend API Changes

When backend API changes:
1. Update API endpoints in `src/api/`
2. Update data models in contexts
3. Test all API integrations
4. Update error handling if needed

## 📚 Additional Resources

- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native BLE PLX](https://github.com/Polidea/react-native-ble-plx)
- [AsyncStorage Guide](https://react-native-async-storage.github.io/async-storage/)
- [Chart Kit Documentation](https://github.com/indiespirit/react-native-chart-kit)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for new components (optional)
3. Add proper error handling
4. Test on both platforms
5. Update documentation

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Your React Native Weight Scale App is Ready!**

The frontend provides a complete, production-ready mobile application with modern UI, real-time Bluetooth connectivity, and comprehensive health tracking features.
