import React from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BluetoothDevice, useBluetooth } from '../hooks/useBluetooth';

const BluetoothManager: React.FC = () => {
  const {
    isEnabled,
    isScanning,
    devices,
    connectedDevice,
    error,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
    requestPermissions,
    clearError,
  } = useBluetooth();

  const handleScanPress = () => {
    if (isScanning) {
      stopScan();
    } else {
      startScan();
    }
  };

  const handleDevicePress = (device: BluetoothDevice) => {
    if (device.isConnected) {
      Alert.alert(
        'Disconnect Device',
        `Do you want to disconnect from ${device.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disconnect', onPress: () => disconnectDevice() },
        ]
      );
    } else {
      Alert.alert(
        'Connect Device',
        `Do you want to connect to ${device.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Connect', onPress: () => connectToDevice(device.id) },
        ]
      );
    }
  };

  const renderDevice = ({ item }: { item: BluetoothDevice }) => (
    <TouchableOpacity
      style={[
        styles.deviceItem,
        item.isConnected && styles.connectedDevice,
      ]}
      onPress={() => handleDevicePress(item)}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>
          {item.name}
          {item.isConnected && ' (Connected)'}
        </Text>
        <Text style={styles.deviceId}>ID: {item.id}</Text>
        {item.rssi && (
          <Text style={styles.deviceRssi}>Signal: {item.rssi} dBm</Text>
        )}
      </View>
      <View style={styles.deviceStatus}>
        {item.isConnected ? (
          <View style={styles.connectedIndicator} />
        ) : (
          <Text style={styles.connectText}>Tap to connect</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Bluetooth Manager</Text>
      
      {/* Bluetooth Status */}
      <View style={styles.statusContainer}>
        <View 
          style={[
            styles.statusIndicator, 
            { backgroundColor: isEnabled ? '#4CAF50' : '#F44336' }
          ]} 
        />
        <Text style={styles.statusText}>
          Bluetooth: {isEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={[styles.scanButton, isScanning && styles.scanningButton]}
        onPress={handleScanPress}
        disabled={!isEnabled}
      >
        {isScanning ? (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.scanButtonText}>Scanning...</Text>
          </View>
        ) : (
          <Text style={styles.scanButtonText}>Start Scan</Text>
        )}
      </TouchableOpacity>

      {/* Connected Device Info */}
      {connectedDevice && (
        <View style={styles.connectedInfo}>
          <Text style={styles.connectedTitle}>Connected to:</Text>
          <Text style={styles.connectedDeviceName}>{connectedDevice.name}</Text>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.clearErrorButton}>
            <Text style={styles.clearErrorText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isScanning
          ? 'Scanning for devices...'
          : 'No devices found. Tap "Start Scan" to discover devices.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Permission Request Button */}
      {!isEnabled && (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Bluetooth permissions required
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
            <Text style={styles.permissionButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  scanButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  scanningButton: {
    backgroundColor: '#FF9800',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectedInfo: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  connectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  connectedDeviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    fontSize: 14,
    color: '#C62828',
    flex: 1,
  },
  clearErrorButton: {
    padding: 4,
  },
  clearErrorText: {
    color: '#C62828',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  connectedDevice: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  deviceRssi: {
    fontSize: 12,
    color: '#999',
  },
  deviceStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  connectedIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  connectText: {
    fontSize: 12,
    color: '#2196F3',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  permissionContainer: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: '#E65100',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BluetoothManager; 