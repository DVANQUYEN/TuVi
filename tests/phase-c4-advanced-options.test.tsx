import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { BirthForm } from '@/components/chart/BirthForm';

function fillRequiredFields(hour: string): void {
  fireEvent.change(screen.getByLabelText(/Giới tính/), { target: { value: 'nam' } });
  fireEvent.change(screen.getByLabelText('Ngày'), { target: { value: '15' } });
  fireEvent.change(screen.getByLabelText('Tháng'), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText('Năm'), { target: { value: '1990' } });
  fireEvent.change(screen.getByLabelText(/Giờ sinh/), { target: { value: hour } });
}

describe('C4 Advanced options', () => {
  afterEach(() => {
    cleanup();
  });

  it('collapses and expands the advanced options section', (): void => {
    render(<BirthForm onSubmit={vi.fn()} />);

    const toggle = screen.getByRole('button', { name: 'Tùy chọn nâng cao' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Trường phái')).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('Trường phái')).toBeInTheDocument();
    expect(screen.getByLabelText('Quy tắc tháng nhuận')).toBeInTheDocument();
    expect(screen.getByLabelText('Năm Can Chi đổi khi')).toBeInTheDocument();
    expect(screen.getByLabelText('Tuần/Triệt')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Trường phái')).not.toBeInTheDocument();
  });

  it('shows the Tý day-boundary option only for hour 0 or 23', (): void => {
    render(<BirthForm onSubmit={vi.fn()} />);

    const hourSelect = screen.getByLabelText(/Giờ sinh/);
    expect(screen.queryByRole('group', { name: /Giờ Tý/ })).not.toBeInTheDocument();

    fireEvent.change(hourSelect, { target: { value: '0' } });
    expect(screen.getByRole('group', { name: /Giờ Tý/ })).toBeInTheDocument();

    fireEvent.change(hourSelect, { target: { value: '5' } });
    expect(screen.queryByRole('group', { name: /Giờ Tý/ })).not.toBeInTheDocument();
  });

  it('renders Bắc phái as a disabled option labelled chưa hỗ trợ', (): void => {
    render(<BirthForm onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Tùy chọn nâng cao' }));

    const school = screen.getByLabelText('Trường phái') as HTMLSelectElement;
    expect(Array.from(school.options).map((option) => option.value)).toEqual([
      'namPhai',
      'trungChau',
      'bacPhai',
    ]);

    const namPhai = screen.getByRole('option', { name: 'Nam phái (mặc định)' });
    const trungChau = screen.getByRole('option', { name: 'Trung Châu' });
    const bacPhai = screen.getByRole('option', { name: 'Bắc phái (chưa hỗ trợ)' });

    expect(namPhai).not.toBeDisabled();
    expect(trungChau).not.toBeDisabled();
    expect(bacPhai).toBeDisabled();
  });

  it('passes selected preferences to onSubmit', (): void => {
    const onSubmit = vi.fn();
    const { container } = render(<BirthForm onSubmit={onSubmit} />);

    fillRequiredFields('4');
    fireEvent.click(screen.getByRole('button', { name: 'Tùy chọn nâng cao' }));
    fireEvent.change(screen.getByLabelText('Trường phái'), { target: { value: 'trungChau' } });
    fireEvent.change(screen.getByLabelText('Quy tắc tháng nhuận'), {
      target: { value: 'nextMonth' },
    });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][1]).toEqual({
      school: 'trungChau',
      leapMonth: 'nextMonth',
    });
  });

  it('submits without preferences when none were changed', (): void => {
    const onSubmit = vi.fn();
    const { container } = render(<BirthForm onSubmit={onSubmit} />);

    fillRequiredFields('4');
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]).toHaveLength(1);
  });
});
