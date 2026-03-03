import { useState } from 'react';

import { useAlertStore } from '@/src/store/alertStore';
import { DEMO_CREDENTIALS } from '@/src/utils/demo';
import { normalizeStudentId } from '@/src/utils/stringHelpers';

import { useAuthStore } from '../store';

export function useLoginData() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlertStore();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      showAlert({
        title: 'Error',
        message: 'Please enter both Student ID and Password',
      });
      return;
    }

    setLoading(true);
    try {
      const normalizedStudentId = normalizeStudentId(studentId);
      const success = await login(normalizedStudentId, password.trim());
      if (!success) {
        showAlert({
          title: 'Login Failed',
          message: 'Invalid Student ID or Password. Please try again.',
        });
      }
    } catch (error: any) {
      showAlert({
        title: 'Error',
        message: error.message || 'An error occurred during login',
      });
    } finally {
      setLoading(false);
    }
  };

  const showCredits = () => {
    showAlert({
      title: 'Credits',
      message: 'Password icons created by Roundicons Premium - Flaticon',
      linkText: 'View Icon',
      linkUrl: 'https://www.flaticon.com/free-icons/password',
    });
  };

  const handleDemoLogin = async () => {
    setStudentId(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);

    setTimeout(async () => {
      setLoading(true);
      try {
        const success = await login(DEMO_CREDENTIALS.username, DEMO_CREDENTIALS.password);
        if (!success) {
          showAlert({
            title: 'Login Failed',
            message: 'Demo login failed. Please try again.',
          });
        }
      } catch (error: any) {
        showAlert({
          title: 'Error',
          message: error.message || 'An error occurred during login',
        });
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return {
    studentId,
    password,
    loading,
    setStudentId,
    setPassword,
    handleLogin,
    showCredits,
    handleDemoLogin,
  };
}
