import { useQuasar, Platform } from 'quasar';

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

  // На мобильных диалог открывается сверху, чтобы клавиатура не перекрывала
  const dialogPosition = Platform.is.mobile ? ('top' as const) : ('standard' as const);

  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      $q.dialog({
        title: options.title,
        message: options.message,
        cancel: true,
        persistent: true,
        position: dialogPosition,
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
        position: dialogPosition,
      })
        .onOk((val: string) => resolve(val.trim()))
        .onCancel(() => resolve(null))
        .onDismiss(() => resolve(null));
    });
  }

  return { confirm, promptText };
}
