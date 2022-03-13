/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import { Notify, QFile } from 'quasar';
import i18n from 'src/config/i18n';

// must define this above the `FormImgUpload` import, otherwise the ReferenceError is raised.
const mockFn = jest.fn();

import FormImgUpload from './FormImgUpload.vue';

installQuasarPlugin({
  plugins: {
    Notify,
  },
});

jest.mock('src/utils', () => ({
  fileToBase64String: jest.fn(),
  fileRef: jest.fn(),
  fileName: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  uploadBytesResumable: mockFn,
  getDownloadURL: jest.fn(() => Promise.resolve('www.test.com/testImage.png')),
}));

describe('FormImgUpload.vue', () => {
  const file = new File(['foo'], 'foo.png', {
    type: 'image/png',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger update:picture event when file is added', async () => {
    const wrapper = mount(FormImgUpload, {
      global: {
        plugins: [i18n],
      },
      props: {
        isUploading: false,
      },
    });
    const input = wrapper.findComponent(QFile);
    await input.setValue(file);
    expect(wrapper.emitted('update:picture')).toHaveLength(1);
  });
  it('should trigger downloadUrlChange event when form is saved', async () => {
    mockFn.mockImplementationOnce(() => ({
      on: (
        _event: string,
        _next: unknown,
        _error: unknown,
        completed: () => unknown
      ) => completed(),
      snapshot: {
        ref: 'testRef',
      },
    }));
    const wrapper = mount(FormImgUpload, {
      global: {
        plugins: [i18n],
      },
      props: {
        isUploading: false,
        picture: file,
      },
    });
    await wrapper.setProps({ isUploading: true });
    expect(wrapper.emitted('downloadUrlChange')).toHaveLength(1);
  });

  it("should'n trigger downloadUrlChange event when doesn't exist file", async () => {
    const wrapper = mount(FormImgUpload, {
      global: {
        plugins: [i18n],
      },
      props: {
        isUploading: false,
      },
    });
    await wrapper.setProps({ isUploading: true });
    expect(wrapper.emitted('downloadUrlChange')).toBeUndefined();
  });

  it('should update progress when file is uploading', async () => {
    mockFn.mockImplementationOnce(() => ({
      on: (
        _event: string,
        next: (snapshot: {
          bytesTransferred: number;
          totalBytes: number;
        }) => unknown,
        _error: unknown,
        _completed: unknown
      ) => next({ bytesTransferred: 100, totalBytes: 200 }),
      snapshot: {
        ref: 'testRef',
      },
    }));
    const wrapper = mount(FormImgUpload, {
      global: {
        plugins: [i18n],
      },
      props: {
        isUploading: false,
        picture: file,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { vm } = wrapper;
    await wrapper.setProps({ isUploading: true });
    expect(
      (vm as unknown as { uploadProgress: number }).uploadProgress
    ).toBeGreaterThan(0);
    expect(wrapper.emitted('downloadUrlChange')).toBeUndefined();
  });

  it("should'n trigger downloadUrlChange event when error ocurred", async () => {
    mockFn.mockImplementationOnce(() => ({
      on: (
        _event: string,
        _next: unknown,
        error: () => unknown,
        _completed: unknown
      ) => error(),
      snapshot: {
        ref: 'testRef',
      },
    }));
    const wrapper = mount(FormImgUpload, {
      global: {
        plugins: [i18n],
      },
      props: {
        isUploading: false,
        picture: file,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { vm } = wrapper;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const spy = jest.spyOn(vm.$q, 'notify');
    await wrapper.setProps({ isUploading: true });
    expect(spy).toHaveBeenCalled();
    expect(wrapper.emitted('downloadUrlChange')).toBeUndefined();
  });
});
