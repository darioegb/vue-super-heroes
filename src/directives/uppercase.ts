export const uppercase = {
  name: 'uppercase',
  function: {
    updated: (el: HTMLElement): void => {
      const input: HTMLInputElement | HTMLTextAreaElement | null =
        el.querySelector('input, textarea');
      if (input) input.value = input.value.toUpperCase();
    },
  },
};
