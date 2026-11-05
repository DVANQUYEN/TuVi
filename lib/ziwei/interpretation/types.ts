import type { EarthlyBranch, BrightnessLevel, MajorStarId, PalaceId } from '../types/enums';

/**
 * Nội dung luận giải của một chính tinh tại một cung với một độ sáng.
 */
export interface MajorStarMeaningContent {
  /** Ý nghĩa chính. */
  meaning: string;
  /** Ảnh hưởng đến sự nghiệp. */
  career: string;
  /** Ảnh hưởng đến tình cảm. */
  love: string;
  /** Ảnh hưởng đến sức khỏe. */
  health: string;
  /** Lời khuyên. */
  advice: string;
}

/**
 * Luận giải cho một chính tinh.
 */
export interface MajorStarInterpretation {
  /** Mã chính tinh. */
  starId: MajorStarId;
  /** Mức độ sáng sau khi chịu tác động của Tuần/Triệt. */
  brightness: BrightnessLevel;
  /** Nội dung luận giải. */
  content: MajorStarMeaningContent;
  /** Sao có bị Tuần/Triệt án ngữ hay không. */
  affected?: boolean;
  /** Sao bị Tuần hay Triệt án ngữ. */
  affectedBy?: 'Tuần' | 'Triệt';
  /** Mức độ sáng ban đầu trước khi bị Tuần/Triệt. */
  originalBrightness?: BrightnessLevel;
  /** Số bậc độ sáng bị giảm. */
  reduction?: number;
  /** Mô tả tác động của Tuần/Triệt. */
  description?: string;
}

/** Mức tác động của một phụ tinh. */
export type MinorStarImpact = 'tốt' | 'xấu' | 'trung bình';

/** Nội dung luận giải chi tiết của một phụ tinh quan trọng. */
export interface MinorStarMeaningContent {
  /** Mức tác động: tốt, xấu hoặc trung bình. */
  impact: MinorStarImpact;
  /** Khía cạnh ảnh hưởng. */
  aspect: string;
  /** Mô tả chi tiết. */
  description: string;
  /** Lời khuyên thực tế. */
  advice: string;
}

/**
 * Luận giải cho một phụ tinh.
 */
export interface MinorStarInterpretation {
  /** Mã sao. */
  starId: string;
  /** Tên hiển thị của sao. */
  name?: string;
  /** Ý nghĩa. */
  meaning: string;
  /** Là sao cát hay hung. */
  isAuspicious: boolean;
  /** Mức tác động. */
  impact?: MinorStarImpact;
  /** Khía cạnh ảnh hưởng. */
  aspect?: string;
  /** Mô tả chi tiết. */
  description?: string;
  /** Lời khuyên thực tế. */
  advice?: string;
  /** Ngữ cảnh cung chứa sao. */
  context?: string;
}

/** Một cung trong tam phương tứ chính. */
export interface TamPhuongPalace {
  /** Mã cung. */
  id: PalaceId;
  /** Tên cung. */
  name: string;
  /** Tên các chính tinh trong cung. */
  majorStars: string[];
  /** Luận giải ngắn về cung. */
  analysis: string;
}

/** Kết quả phân tích tam phương tứ chính của một cung. */
export interface TamPhuongAnalysis {
  /** Ba cung liên quan (xung chiếu và hai cung tam hợp). */
  palaces: TamPhuongPalace[];
  /** Tổng hợp tương quan giữa các cung. */
  summary: string;
}

/**
 * Luận giải cho một cách cục sao.
 */
export interface CombinationInterpretation {
  /** Mã cách cục. */
  id: string;
  /** Tên cách cục. */
  name: string;
  /** Điều kiện nhận diện. */
  condition: {
    /** Các sao cần có (chính tinh hoặc phụ tinh). */
    stars: string[];
    /** Cung cụ thể (tùy chọn). */
    palace?: PalaceId;
    /** Các mức độ sáng chấp nhận (tùy chọn). */
    brightness?: BrightnessLevel[];
    /** Các cung chi cụ thể (tùy chọn). */
    branch?: EarthlyBranch[];
  };
  /** Ý nghĩa cách cục. */
  meaning: string;
  /** Mức độ tốt xấu. */
  level: 'tốt' | 'xấu' | 'trung bình';
}

/** Bộ sao - nhóm các sao tương tác cùng nhau. */
export interface StarGroup {
  /** Mã bộ sao. */
  id: string;
  /** Tên bộ sao. */
  name: string;
  /** Tên các sao trong bộ. */
  stars: string[];
  /** Ý nghĩa của bộ sao. */
  meaning: string;
  /** Mức độ tốt xấu. */
  level: 'tốt' | 'xấu' | 'trung bình';
  /** Phạm vi nhận diện: trong một cung hoặc trong tam phương. */
  scope?: 'palace' | 'tamPhuong';
}

/**
 * Nội dung luận giải theo đúng ý nghĩa của từng loại cung.
 * Mỗi cung chỉ sử dụng các trường phù hợp, các trường còn lại để trống.
 */
export interface PalaceSpecificContent {
  /** Tổng quan về cung. */
  overview: string;

  /** Cung Mệnh: tính cách, bản chất. */
  personality?: string;
  /** Cung Mệnh: điểm mạnh. */
  character?: string;
  /** Cung Mệnh: số mệnh chung. */
  destiny?: string;

  /** Cung Tài Bạch: nguồn thu nhập. */
  income?: string;
  /** Cung Tài Bạch: tài lộc, tích lũy. */
  wealth?: string;

  /** Cung Quan Lộc: công việc, thăng tiến. */
  career?: string;
  /** Cung Quan Lộc: nghề nghiệp phù hợp. */
  profession?: string;

  /** Cung Thiên Di: di chuyển. */
  travel?: string;
  /** Cung Thiên Di: xuất ngoại, thay đổi nơi ở. */
  migration?: string;

  /** Cung Phu Thê: đặc điểm người phối ngẫu. */
  spouse?: string;
  /** Cung Phu Thê: chất lượng hôn nhân. */
  marriage?: string;

  /** Cung Tử Tức: con cái, hậu vận. */
  children?: string;
  /** Cung Tử Tức: học hành của con. */
  offspring?: string;

  /** Cung Tật Ách: sức khỏe tổng quát. */
  health?: string;
  /** Cung Tật Ách: bệnh cần chú ý. */
  illness?: string;

  /** Cung Nô Bộc: bạn bè, đồng nghiệp. */
  friends?: string;
  /** Cung Nô Bộc: quan hệ xã hội. */
  social?: string;

  /** Cung Điền Trạch: nhà cửa. */
  property?: string;
  /** Cung Điền Trạch: bất động sản, tích lũy. */
  realEstate?: string;

  /** Cung Phúc Đức: phúc đức, may mắn. */
  fortune?: string;
  /** Cung Phúc Đức: tổ tiên, dòng họ. */
  ancestors?: string;

  /** Cung Phụ Mẫu: quan hệ với cha mẹ. */
  parents?: string;
  /** Cung Phụ Mẫu: không khí gia đình. */
  family?: string;

  /** Cung Huynh Đệ: anh chị em. */
  siblings?: string;
  /** Cung Huynh Đệ: quan hệ anh em. */
  brothers?: string;

  /** Thách thức của cung. */
  challenges: string;
  /** Lời khuyên cho cung. */
  advice: string;
}

/** Tên cũ của nội dung luận giải theo loại cung. */
export type PalaceContent = PalaceSpecificContent;

/**
 * Luận giải cho một cung trong lá số.
 */
export interface PalaceInterpretation {
  /** Mã cung. */
  palaceId: PalaceId;
  /** Nội dung luận giải theo ý nghĩa thực sự của cung. */
  content?: PalaceContent;
  /** Nội dung luận giải chi tiết theo đúng ý nghĩa của cung. */
  specificContent?: PalaceSpecificContent;
  /** Các chính tinh trong cung. */
  majorStars: MajorStarInterpretation[];
  /** Các phụ tinh trong cung. */
  minorStars: MinorStarInterpretation[];
  /** Các cách cục tại cung. */
  combinations: CombinationInterpretation[];
  /** Các bộ sao tại cung. */
  starGroups?: StarGroup[];
  /** Cung Vô Chính Diệu. */
  isEmpty: boolean;
  /** Phân tích tam phương tứ chính của cung. */
  tamPhuong?: TamPhuongAnalysis;
}

/**
 * Luận giải toàn bộ lá số.
 */
export interface ChartInterpretation {
  /** Luận giải các cung. */
  palaces: PalaceInterpretation[];
  /** Các cách cục toàn cục. */
  combinations: CombinationInterpretation[];
  /** Lời khuyên tổng quan. */
  overallAdvice: string;
}
