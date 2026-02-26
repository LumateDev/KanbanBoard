import { useQuasar } from 'quasar';

interface ConfirmOptions {
  title: string;
  message: string;
}

interface PromptOptions {
  title: string;
  message: string;
}

export function useAppDialog() {
  const $q = useQuasar();

  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      $q.dialog({
        title: options.title,
        message: options.message,
        cancel: true,
        persistent: true,
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
        .onDismiss(() => resolve(false));
    });
  }

  function promptText(options: PromptOptions): Promise<string | null> {
    return new Promise((resolve) => {
      $q.dialog({
        title: options.title,
        message: options.message,
        prompt: {
          model: '',
          type: 'text',
          isValid: (val: string) => val.trim().length > 0,
        },
        cancel: true,
      })
        .onOk((val: string) => resolve(val.trim()))
        .onCancel(() => resolve(null))
        .onDismiss(() => resolve(null));
    });
  }

  return { confirm, promptText };
}
