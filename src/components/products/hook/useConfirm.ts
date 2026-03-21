import { useState, useCallback } from 'react';
import type { ConfirmConfig } from '@/type/product';
export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState<
    (ConfirmConfig & { action: () => Promise<void> }) | null
  >(null);

  // 開啟確認 Modal
  const confirm = useCallback(
    (config: ConfirmConfig, action: () => Promise<void>) => {
      setConfig({ ...config, action });
      setError('');
      setIsOpen(true);
    },
    []
  );

  // 執行確認
  const handleConfirm = useCallback(async () => {
    if (!config) return;

    setIsLoading(true);
    setError('');

    try {
      await config.action(); //api
      setIsOpen(false);
      setConfig(null);
      config.onSuccess?.(); //callback
    } catch (err: unknown) {
      let errorMessage = 'something went wrong, please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // 關閉時清除錯誤
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError('');
    }
  }, []);

  return {
    isOpen,
    isLoading,
    error,
    title: config?.title ?? '',
    message: config?.message ?? '',
    confirm,
    handleConfirm,
    handleOpenChange,
  };
}
