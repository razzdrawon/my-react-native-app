import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, State } from 'react-native-ble-plx';

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi?: number;
  isConnected?: boolean;
}

export interface BluetoothState {
  isEnabled: boolean;
  isScanning: boolean;
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  error: string | null;
}

export const useBluetooth = () => {
  const [state, setState] = useState<BluetoothState>({
    isEnabled: false,
    isScanning: false,
    devices: [],
    connectedDevice: null,
    error: null,
  });

  const [bleManager] = useState(() => new BleManager());

  // Check if Bluetooth is enabled
  const checkBluetoothEnabled = useCallback(async () => {
    try {
      const state = await bleManager.state();
      const isEnabled = state === State.PoweredOn;
      setState(prev => ({ ...prev, isEnabled }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to check Bluetooth status' 
      }));
    }
  }, [bleManager]);

  // Request Bluetooth permissions
  const requestPermissions = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        const allGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (allGranted) {
          await checkBluetoothEnabled();
        } else {
          setState(prev => ({ 
            ...prev, 
            error: 'Bluetooth permissions not granted' 
          }));
        }
      } else {
        // iOS permissions are handled automatically
        await checkBluetoothEnabled();
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to request permissions' 
      }));
    }
  }, [checkBluetoothEnabled]);

  // Start scanning for devices
  const startScan = useCallback(async () => {
    if (!state.isEnabled) {
      setState(prev => ({ ...prev, error: 'Bluetooth is not enabled' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isScanning: true, error: null }));
      
      // Clear previous devices
      setState(prev => ({ ...prev, devices: [] }));

      // Start scanning
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('Scan error:', error);
          return;
        }

        if (device && device.name) {
          setState(prev => ({
            ...prev,
            devices: prev.devices.some(d => d.id === device.id) 
              ? prev.devices 
              : [...prev.devices, {
                  id: device.id,
                  name: device.name || 'Unknown Device',
                  rssi: device.rssi || undefined,
                  isConnected: false,
                }]
          }));
        }
      });

      // Stop scanning after 10 seconds
      setTimeout(() => {
        bleManager.stopDeviceScan();
        setState(prev => ({ ...prev, isScanning: false }));
      }, 10000);

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isScanning: false,
        error: error instanceof Error ? error.message : 'Failed to start scanning' 
      }));
    }
  }, [state.isEnabled, bleManager]);

  // Stop scanning
  const stopScan = useCallback(async () => {
    try {
      bleManager.stopDeviceScan();
      setState(prev => ({ ...prev, isScanning: false }));
    } catch (error) {
      console.log('Error stopping scan:', error);
    }
  }, [bleManager]);

  // Connect to a device
  const connectToDevice = useCallback(async (deviceId: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Find the device in our list
      const device = state.devices.find(d => d.id === deviceId);
      if (!device) {
        setState(prev => ({ ...prev, error: 'Device not found' }));
        return;
      }

      // Connect to the device
      const connectedDevice = await bleManager.connectToDevice(deviceId);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      setState(prev => ({
        ...prev,
        connectedDevice: { ...device, isConnected: true },
        devices: prev.devices.map(d => 
          d.id === deviceId ? { ...d, isConnected: true } : d
        )
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to connect to device' 
      }));
    }
  }, [state.devices, bleManager]);

  // Disconnect from device
  const disconnectDevice = useCallback(async () => {
    if (!state.connectedDevice) return;

    try {
      await bleManager.cancelDeviceConnection(state.connectedDevice.id);
      
      setState(prev => ({
        ...prev,
        connectedDevice: null,
        devices: prev.devices.map(d => ({ ...d, isConnected: false }))
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to disconnect' 
      }));
    }
  }, [state.connectedDevice, bleManager]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize Bluetooth
  useEffect(() => {
    requestPermissions();
    
    // Listen for Bluetooth state changes
    const subscription = bleManager.onStateChange((state) => {
      const isEnabled = state === State.PoweredOn;
      setState(prev => ({ ...prev, isEnabled }));
    }, true);
    
    // Cleanup on unmount
    return () => {
      subscription.remove();
      if (state.connectedDevice) {
        disconnectDevice();
      }
      bleManager.destroy();
    };
  }, []);

  return {
    ...state,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
    requestPermissions,
    checkBluetoothEnabled,
    clearError,
  };
}; 