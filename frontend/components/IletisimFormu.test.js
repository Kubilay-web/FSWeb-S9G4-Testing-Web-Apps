import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
  render(<IletisimFormu />);
});

test('iletişim formu headerı render ediliyor', () => {
  render(<IletisimFormu />);
  const headerElement = screen.getByRole('heading', { Name: /iletişim Formu/i });
  expect(headerElement).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText('Ad');
  userEvent.type(adInput, 'abc');
  const errorMessage = await screen.findByTestId('error');
  expect(errorMessage).toHaveTextContent('Hata: ad en az 5 karakter olmalıdır.');
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
  render(<IletisimFormu />);
  const submitButton = screen.getByRole('button', { name: /gönder/i });
  userEvent.click(submitButton);

  const adErrorMessage = await screen.findByTestId('error-ad');
  const soyadErrorMessage = await screen.findByTestId('error-soyad');
  const emailErrorMessage = await screen.findByTestId('error-email');

  expect(adErrorMessage).toHaveTextContent('Hata: ad gereklidir.');
  expect(soyadErrorMessage).toHaveTextContent('Hata: soyad gereklidir.');
  expect(emailErrorMessage).toHaveTextContent('Hata: email gereklidir.');
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText('Ad');
  const soyadInput = screen.getByLabelText('Soyad');
  userEvent.type(adInput, 'John');
  userEvent.type(soyadInput, 'Doe');

  const submitButton = screen.getByRole('button', { name: /gönder/i });
  userEvent.click(submitButton);

  const emailErrorMessage = await screen.findByTestId('error-email');
  expect(emailErrorMessage).toHaveTextContent('Hata: email gereklidir.');
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const emailInput = screen.getByLabelText('Email');
  userEvent.type(emailInput, 'invalid-email');
  const errorMessage = await screen.findByTestId('error-email');
  expect(errorMessage).toHaveTextContent('Hata: email geçerli bir email adresi olmalıdır.');
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText('Ad');
  userEvent.type(adInput, 'John');

  const submitButton = screen.getByRole('button', { name: /gönder/i });
  userEvent.click(submitButton);

  const soyadErrorMessage = await screen.findByTestId('error-soyad');
  expect(soyadErrorMessage).toHaveTextContent('Hata: soyad gereklidir.');
});

test('ad, soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText('Ad');
  const soyadInput = screen.getByLabelText('Soyad');
  const emailInput = screen.getByLabelText('Email');

  userEvent.type(adInput, 'John');
  userEvent.type(soyadInput, 'Doe');
  userEvent.type(emailInput, 'john.doe@example.com');

  const submitButton = screen.getByRole('button', { name: /gönder/i });
  userEvent.click(submitButton);

  await waitFor(() => {
    const errorMessage = screen.queryByText('Hata: mesaj gereklidir.');
    expect(errorMessage).toBeNull();
  });
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText('Ad');
  const soyadInput = screen.getByLabelText('Soyad');
  const emailInput = screen.getByLabelText('Email');
  const mesajInput = screen.getByLabelText('Mesaj');

  userEvent.type(adInput, 'John');
  userEvent.type(soyadInput, 'Doe');
  userEvent.type(emailInput, 'john.doe@example.com');
  userEvent.type(mesajInput, 'Merhaba, size ulaşmak istiyorum.');

  const submitButton = screen.getByRole('button', { name: /gönder/i });
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText('Ad: John')).toBeInTheDocument();
    expect(screen.getByText('Soyad: Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Mesaj: Merhaba, size ulaşmak istiyorum.')).toBeInTheDocument();
  });
});
