import { EARTHLY_BRANCHES_DATA } from '@/lib/ziwei/data/stems-branches';
import type { EarthlyBranch, FiveElement } from '@/lib/ziwei/types/enums';
import { BRANCH_LABELS } from '@/lib/ziwei/zodiac-compatibility';
import {
  HOUR_SLOTS,
  getBranchRelation,
  type BranchRelation,
  type DailyCalendar,
} from './daily-calendar';

export interface DailyLuckyHour {
  branch: EarthlyBranch;
  label: string;
  time: string;
}

export interface DailyContent {
  relation: BranchRelation;
  relationLabel: string;
  relationNote: string;
  headline: string;
  elementNote: string;
  shouldDo: string[];
  shouldAvoid: string[];
  advice: string;
  luckyHours: DailyLuckyHour[];
  day: {
    canChi: string;
    napAm: string;
    elementLabel: string;
    truc: string;
    conflict: string;
    viewer: string;
  };
}

type RelationTone = 'positive' | 'neutral' | 'challenging';
type ElementRelation = 'same' | 'generates' | 'controls';

const RELATION_LABELS: Readonly<Record<BranchRelation, string>> = {
  tamHop: 'Tam hợp',
  lucHop: 'Lục hợp',
  same: 'Đồng khí',
  binh: 'Ổn định',
  tuHinh: 'Tứ hình',
  lucHai: 'Lục hại',
  lucXung: 'Xung khắc',
};

const RELATION_TONES: Readonly<Record<BranchRelation, RelationTone>> = {
  tamHop: 'positive',
  lucHop: 'positive',
  same: 'neutral',
  binh: 'neutral',
  tuHinh: 'challenging',
  lucHai: 'challenging',
  lucXung: 'challenging',
};

const RELATION_NOTES: Readonly<Record<BranchRelation, string>> = {
  tamHop: 'Hai chi tam hợp, khí vận tương trợ nên thuận cho việc mở rộng và kết nối.',
  lucHop: 'Hai chi lục hợp, quan hệ hòa thuận nên dễ tìm được tiếng nói chung.',
  same: 'Cùng chi với tuổi, năng lượng đồng điệu nhưng cần giữ nhịp vừa phải để tránh tự tin quá mức.',
  binh: 'Không thuộc nhóm xung hợp, ngày ở trạng thái ổn định, phù hợp duy trì nhịp cũ.',
  tuHinh: 'Hai chi tứ hình, dễ phát sinh bất đồng nhỏ nên cần lắng nghe và kiểm tra kỹ.',
  lucHai: 'Hai chi lục hại, dễ hiểu lầm trong giao tiếp nên cần nói rõ ý và tránh suy diễn.',
  lucXung: 'Hai chi xung khắc, khí vận đối nghịch nên hạn chế quyết định lớn và giữ bình tĩnh.',
};

const HEADLINE_ENDINGS: Readonly<Record<RelationTone, string>> = {
  positive: 'Thuận lợi để triển khai việc đã chuẩn bị.',
  neutral: 'giữ nhịp và hoàn tất việc đang làm.',
  challenging: 'Biến động, nên thận trọng và giữ tĩnh lặng.',
};

const ELEMENT_LABELS: Readonly<Record<FiveElement, string>> = {
  kim: 'Kim',
  moc: 'Mộc',
  thuy: 'Thủy',
  hoa: 'Hỏa',
  tho: 'Thổ',
};

const ELEMENT_GENERATES: Readonly<Record<FiveElement, FiveElement>> = {
  kim: 'thuy',
  thuy: 'moc',
  moc: 'hoa',
  hoa: 'tho',
  tho: 'kim',
};

const ELEMENT_CONTROLS: Readonly<Record<FiveElement, FiveElement>> = {
  kim: 'moc',
  moc: 'tho',
  tho: 'thuy',
  thuy: 'hoa',
  hoa: 'kim',
};

interface TrucGuidance {
  do: readonly string[];
  avoid: readonly string[];
}

const TRUC_GUIDANCE: Readonly<Record<string, TrucGuidance>> = {
  Kiến: {
    do: ['Khởi động việc mới trong phạm vi đã chuẩn bị', 'Đặt lịch họp hoặc gặp gỡ đối tác'],
    avoid: ['Mở rộng cam kết vượt quá nguồn lực', 'Động thổ hoặc thay đổi lớn khi chưa khảo sát'],
  },
  Trừ: {
    do: ['Dọn dẹp, chấm dứt việc tồn đọng', 'Chữa bệnh, thanh lọc thói quen cũ'],
    avoid: ['Khởi công việc mới', 'Cưới hỏi hoặc ký kết dài hạn'],
  },
  Mãn: {
    do: ['Hoàn tất việc đang dang dở', 'Chốt kế hoạch trong khả năng'],
    avoid: ['Vay mượn thêm', 'Mở rộng danh mục đầu tư'],
  },
  Bình: {
    do: ['Đàm phán, thương lượng cân bằng', 'Sắp xếp lại lịch làm việc'],
    avoid: ['Quyết định liều lĩnh', 'Tranh cãi để giành phần hơn'],
  },
  Định: {
    do: ['Ký kết thỏa thuận đã rõ ràng', 'Cố định lịch trình, cam kết dài hạn'],
    avoid: ['Thay đổi kế hoạch giữa chừng', 'Khởi sự việc còn mơ hồ'],
  },
  Chấp: {
    do: ['Hoàn thiện giấy tờ, hồ sơ pháp lý', 'Giải quyết việc hành chính'],
    avoid: ['Vay mượn tiền hoặc bảo lãnh', 'Ký cam kết khi chưa đọc kỹ'],
  },
  Phá: {
    do: ['Xử lý việc nhỏ, sửa chữa trong nhà', 'Dọn bỏ vật cũ, cắt giảm chi phí'],
    avoid: ['Khởi công, động thổ, xây dựng', 'Ký kết lớn hoặc cưới hỏi'],
  },
  Nguy: {
    do: ['Kiểm tra an toàn, phòng ngừa rủi ro', 'Hoàn tất việc nhỏ đã có kế hoạch'],
    avoid: ['Leo trèo, làm việc trên cao', 'Quyết định lớn khi thiếu thông tin'],
  },
  Thành: {
    do: ['Chốt việc quan trọng đã chuẩn bị', 'Khai trương, ký kết, gặp đối tác'],
    avoid: ['Trì hoãn bước cuối', 'Thay đổi tiêu chí đánh giá'],
  },
  Thu: {
    do: ['Thu hồi công nợ, chốt doanh thu', 'Nhận bàn giao, kiểm kê tài sản'],
    avoid: ['Đầu tư mạo hiểm hoặc cho vay', 'Mở rộng chi tiêu ngoài kế hoạch'],
  },
  Khai: {
    do: ['Khai trương, ký kết, đàm phán', 'Mở đầu dự án mới với mục tiêu rõ'],
    avoid: ['Đóng cửa cơ hội đã chuẩn bị', 'Cam kết khi chưa nắm rõ điều khoản'],
  },
  Bế: {
    do: ['Hoàn tất việc nội bộ, tổng kết', 'Rà soát hồ sơ trước khi lưu trữ'],
    avoid: ['Khai trương, nhập học, xuất hành xa', 'Mở việc mới hoặc ký cam kết lớn'],
  },
};

const DEFAULT_TRUC_GUIDANCE: TrucGuidance = {
  do: ['Hoàn tất việc đang làm theo kế hoạch đã có'],
  avoid: ['Mở rộng cam kết khi chưa đủ thông tin'],
};

function getElementRelation(
  dayElement: FiveElement,
  viewerElement: FiveElement
): ElementRelation {
  if (dayElement === viewerElement) return 'same';
  if (
    ELEMENT_GENERATES[dayElement] === viewerElement ||
    ELEMENT_GENERATES[viewerElement] === dayElement
  ) {
    return 'generates';
  }
  return 'controls';
}

function getElementNote(dayElement: FiveElement, viewerElement: FiveElement): string {
  const dayLabel = ELEMENT_LABELS[dayElement];
  const viewerLabel = ELEMENT_LABELS[viewerElement];
  const relation = getElementRelation(dayElement, viewerElement);

  if (relation === 'same') {
    return `Nạp âm ngày ${dayLabel} đồng khí với tuổi ${viewerLabel}: nên củng cố nền tảng và giữ nhịp ổn định.`;
  }

  if (relation === 'generates') {
    if (ELEMENT_GENERATES[dayElement] === viewerElement) {
      return `Nạp âm ngày ${dayLabel} tương sinh cho tuổi ${viewerLabel}: nên tận dụng hỗ trợ sẵn có để triển khai việc đã chuẩn bị.`;
    }
    return `Tuổi ${viewerLabel} tương sinh cho nạp âm ngày ${dayLabel}: nên chia sẻ nguồn lực có chọn lọc và tránh dàn trải.`;
  }

  if (ELEMENT_CONTROLS[dayElement] === viewerElement) {
    return `Nạp âm ngày ${dayLabel} tương khắc với tuổi ${viewerLabel}: nên giảm va chạm và kiểm tra kỹ trước khi cam kết.`;
  }
  return `Tuổi ${viewerLabel} tương khắc với nạp âm ngày ${dayLabel}: nên giữ nhịp độ vừa phải và tránh áp đặt.`;
}

function getElementAction(relation: ElementRelation): string {
  if (relation === 'same') {
    return 'Củng cố nền tảng sẵn có, tránh thay đổi quá nhiều biến số trong ngày.';
  }
  if (relation === 'generates') {
    return 'Tận dụng nguồn lực sẵn có để mở rộng việc đang làm.';
  }
  return 'Giữ nhịp độ vừa phải và kiểm tra kỹ trước khi cam kết.';
}

/** Tránh lặp lại lời khuyên khai trương/ký kết khi quan hệ ngày đang ở mức biến động. */
function getChallengingDo(primary: string): string {
  if (/ký kết|khai trương/i.test(primary)) {
    return 'Ưu tiên việc nhỏ, giấy tờ đã rõ ràng; hoãn khai trương hoặc ký kết lớn sang dịp khác.';
  }
  return primary;
}

function formatHour(branch: EarthlyBranch | undefined): string {
  if (!branch) return 'giờ hoàng đạo';
  return `${BRANCH_LABELS[branch]} (${HOUR_SLOTS[branch]})`;
}

function getLuckyHours(calendar: DailyCalendar): DailyLuckyHour[] {
  return calendar.luckyHours.map((branch) => ({
    branch,
    label: BRANCH_LABELS[branch],
    time: HOUR_SLOTS[branch],
  }));
}

export function generateDailyContent(
  viewerBranch: EarthlyBranch,
  calendar: DailyCalendar
): DailyContent {
  const viewerElement =
    EARTHLY_BRANCHES_DATA.find((item) => item.branch === viewerBranch)?.element ?? 'tho';
  const relation = getBranchRelation(viewerBranch, calendar.dayBranch);
  const relationLabel = RELATION_LABELS[relation];
  const tone = RELATION_TONES[relation];
  const guidance = TRUC_GUIDANCE[calendar.truc.name] ?? DEFAULT_TRUC_GUIDANCE;
  const elementRelation = getElementRelation(calendar.dayNapAmElement, viewerElement);
  const elementAction = getElementAction(elementRelation);
  const elementNote = getElementNote(calendar.dayNapAmElement, viewerElement);
  const primaryHour = formatHour(calendar.luckyHours[0]);
  const viewerLabel = BRANCH_LABELS[viewerBranch];

  const headline = `Ngày ${calendar.dayCanChi}, trực ${calendar.truc.name}, quan hệ ${relationLabel} với tuổi ${viewerLabel}: ${HEADLINE_ENDINGS[tone]}`;

  const day = {
    canChi: calendar.dayCanChi,
    napAm: calendar.napAm,
    elementLabel: calendar.dayNapAmElementLabel,
    truc: calendar.truc.name,
    conflict: BRANCH_LABELS[calendar.conflictBranch],
    viewer: viewerLabel,
  };

  const luckyHours = getLuckyHours(calendar);

  if (tone === 'positive') {
    return {
      relation,
      relationLabel,
      relationNote: RELATION_NOTES[relation],
      headline,
      elementNote,
      shouldDo: [
        `Dùng giờ ${primaryHour} để chốt việc quan trọng hoặc đàm phán tài chính.`,
        guidance.do[0],
        elementAction,
      ],
      shouldAvoid: [
        'Trì hoãn quyết định đã đủ thông tin, đặc biệt trong khung giờ hoàng đạo buổi sáng.',
        'Ký kết khi chưa đọc kỹ điều khoản hoặc chưa đối chiếu số liệu.',
        guidance.avoid[0],
      ],
      advice:
        'Giữ năng lượng tích cực và tự tin triển khai kế hoạch đã chuẩn bị; chốt bước quan trọng trong giờ hoàng đạo.',
      luckyHours,
      day,
    };
  }

  if (tone === 'neutral') {
    return {
      relation,
      relationLabel,
      relationNote: RELATION_NOTES[relation],
      headline,
      elementNote,
      shouldDo: [
        'Duy trì nhịp làm việc hiện tại và dọn dẹp việc tồn đọng.',
        guidance.do[0],
        'Rà soát kế hoạch và chuẩn bị cho bước tiếp theo thay vì mở việc mới.',
      ],
      shouldAvoid: [
        'Ra quyết định lớn khi thông tin chưa đầy đủ.',
        'Đầu tư mạo hiểm hoặc tranh cãi để giành phần hơn.',
        guidance.avoid[0],
      ],
      advice:
        'Giữ nhịp ổn định, ưu tiên việc đã có kế hoạch và tránh tranh cãi không cần thiết.',
      luckyHours,
      day,
    };
  }

  return {
    relation,
    relationLabel,
    relationNote: RELATION_NOTES[relation],
    headline,
    elementNote,
    shouldDo: [
      'Rà soát hợp đồng, giấy tờ pháp lý; chỉ xử lý việc nhỏ trong ngày.',
      getChallengingDo(guidance.do[0]),
      `Làm việc độc lập; dùng giờ ${primaryHour} cho việc nhỏ, không cho quyết định lớn.`,
    ],
    shouldAvoid: [
      'Ký kết giấy tờ quan trọng vào buổi chiều.',
      'Tranh luận hoặc thúc ép đối tác, đồng nghiệp.',
      guidance.avoid[0],
    ],
    advice:
      'Tiết chế cái tôi, giữ tĩnh lặng theo “dĩ hòa vi quý”; xử lý việc nhỏ và chờ thời điểm rõ ràng hơn.',
    luckyHours,
    day,
  };
}
