import type { Student } from "@custom-types/exam.type";

/**
 * 학생 인적 사항 더미 데이터를 반환하는 모의 API 함수
 */
export const getStudent = async (): Promise<Student> => {
  // 실제 API가 없으므로 500ms 후 더미 데이터 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "홍정기",
        school: "학교",
        // 학년, 번호, 좌석 번호는 학생 정보에 포함된다고 가정하고 작성했습니다.
        grade: 1,
        studentNumber: 12,
        seatNumber: 3,
      });
    }, 500);
  });
};
