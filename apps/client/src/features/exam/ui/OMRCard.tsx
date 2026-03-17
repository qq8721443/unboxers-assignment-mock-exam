import logoImage from "../assets/logo-image.png";

interface OMRCardProps {
  student: {
    name: string;
    school: string;
    seatNumber: string;
    supervisor: string;
    grade?: number;
    tens?: number;
    units?: number;
  };
  exam: {
    title: string;
    subject: string;
  };
  markedAnswers: Record<number, number[] | string>;
  activeQuestion?: number;
  tempSubjectiveValue?: string; // 실시간 입력값 추가
  onMarkObjective: (qNum: number, v: number) => void;
  onSelectSubjective: (qNum: number) => void;
  onSelectGrade: (grade: number | undefined) => void;
  onSelectTens: (val: number | undefined) => void;
  onSelectUnits: (val: number | undefined) => void;
}

export function OMRCard({
  student,
  exam,
  markedAnswers,
  activeQuestion,
  tempSubjectiveValue,
  onMarkObjective,
  onSelectSubjective,
  onSelectGrade,
  onSelectTens,
  onSelectUnits,
}: OMRCardProps) {
  const grades = [1, 2, 3];
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleGradeClick = (n: number) => {
    onSelectGrade(student.grade === n ? undefined : n);
  };

  const handleTensClick = (n: number) => {
    onSelectTens(student.tens === n ? undefined : n);
  };

  const handleUnitsClick = (n: number) => {
    onSelectUnits(student.units === n ? undefined : n);
  };

  return (
    <div className="bg-[#fffdf1] rounded-[32px] p-[16px_24px_4px_24px] flex flex-col items-center justify-center shadow-strong w-[1262px] h-[659px] select-none shrink-0 font-pretendard border-none">
      <div className="flex items-center justify-start w-[1214px] h-[613px]">
        {/* 1. 인적 사항 & 로고 */}
        <div className="w-[200px] h-[612px] flex flex-col justify-between">
          <div className="flex flex-col border-t-[1.5px] border-l-[1.5px] border-[#5784f1]">
            <InfoRow label="시 험" value={exam.title} />
            <InfoRow label="과 목" value={exam.subject} />
            <InfoRow label="성 명" value={student.name} />
            <InfoRow label="학 교" value={student.school} />
            <InfoRow label="좌 석" value={student.seatNumber} />
            <InfoRow label="감 독" value={student.supervisor} />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4 mr-2 text-[#364f8e]">
            <div className="flex flex-col items-center gap-2 px-7.5">
              <img src={logoImage} alt="베이스 수학학원" className="" />
            </div>
            <div className="text-center flex flex-col gap-2">
              <p className="font-bold text-2xl">학생답안 입력용 OMR 카드</p>
              <p className="text-xs opacity-90 whitespace-pre-line">
                {`객관식 답안은 터치해서 칠하고, 주관식 답안은 터치한 뒤 키패드로 입력해요.

                답안을 작성하지 않고 제출하면 별도의 경고 없이 오답으로 처리되니 주의하세요.`}
              </p>
            </div>
          </div>
        </div>

        {/* 2. 학년 마킹 */}
        <div className="w-[36px] h-[612px] flex flex-col">
          <div className="h-10 border-[1.5px] border-[#5784f1] flex items-center justify-center bg-white">
            <span className="text-[#364f8e] text-[13px] font-bold leading-[1.2] text-center whitespace-pre">
              {"학\n년"}
            </span>
          </div>
          <div className="flex-1 border-[1.5px] border-[#5784f1] border-t-0 p-[12px_8px] flex flex-col gap-[12px] items-center bg-white">
            {grades.map((n) => (
              <MarkingButton
                key={n}
                value={n}
                selected={student.grade === n}
                onClick={() => handleGradeClick(n)}
              />
            ))}
          </div>
        </div>

        {/* 3. 번호 마킹 */}
        <div className="w-[66px] h-[612px] flex flex-col">
          <div className="h-10 border-[1.5px] border-[#5784f1] border-l-0 flex items-center justify-center bg-white">
            <span className="text-[#364f8e] text-[13px] font-bold">번호</span>
          </div>
          <div className="flex-1 border-[1.5px] border-[#5784f1] border-t-0 border-l-0 flex gap-0 bg-[#5784f1]">
            <div className="flex-1 flex flex-col gap-[12px] items-center bg-white p-[12px_8px] pr-[5px]">
              {digits.map((n) => (
                <MarkingButton
                  key={n}
                  value={n}
                  selected={student.tens === n}
                  onClick={() => handleTensClick(n)}
                />
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-[12px] items-center bg-white p-[12px_8px] pl-[5px]">
              {digits.map((n) => (
                <MarkingButton
                  key={n}
                  value={n}
                  selected={student.units === n}
                  onClick={() => handleUnitsClick(n)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4. 객관식 답안 */}
        <div className="w-[552px] h-[612px] flex flex-col">
          <div className="h-10 border-[1.5px] border-[#5784f1] border-l-0 flex items-center justify-center bg-white">
            <span className="text-[#364f8e] text-[15px] font-bold tracking-[1em] ml-[1em]">
              객관식답안
            </span>
          </div>
          <div className="flex-1 border-[1.5px] border-[#5784f1] border-t-0 border-l-0 flex bg-white">
            {[0, 10, 20].map((base) => (
              <div
                key={base}
                className="w-[184px] h-full flex border-r-[1.5px] border-[#5784f1] last:border-r-0"
              >
                <div className="w-7 h-full bg-[#5784f1]/20 border-r-[1.5px] border-[#5784f1] flex flex-col p-[12px_0]">
                  {Array.from({ length: 10 }, (_, i) => {
                    const qNum = base + i + 1;
                    return (
                      <div
                        key={qNum}
                        className="flex-1 flex items-center justify-center text-[#364f8e] text-[13px] font-bold"
                      >
                        {qNum}
                      </div>
                    );
                  })}
                </div>
                <div className="flex-1 h-full flex flex-col p-[12px_8px] gap-[12px]">
                  {Array.from({ length: 10 }, (_, i) => {
                    const qNum = base + i + 1;
                    const currentMarks =
                      (markedAnswers[qNum] as number[]) || [];
                    return (
                      <div
                        key={qNum}
                        className="flex-1 flex items-center justify-center gap-[10px]"
                      >
                        {[1, 2, 3, 4, 5].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => onMarkObjective(qNum, v)}
                            className={`w-5 h-11 rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                              currentMarks.includes(v)
                                ? "bg-[#090909] text-white scale-105 shadow-md"
                                : "bg-[#a5a4a0] text-white hover:bg-gs-3"
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 주관식 답안 */}
        <div className="w-[360px] h-[612px] flex flex-col">
          <div className="h-10 border-[1.5px] border-[#5784f1] border-l-0 flex items-center justify-center bg-white">
            <span className="text-[#364f8e] text-[15px] font-bold tracking-[1em] ml-[1em]">
              주관식답안
            </span>
          </div>
          <div className="flex-1 border-[1.5px] border-[#5784f1] border-t-0 border-l-0 flex flex-col bg-white">
            {Array.from({ length: 12 }, (_, i) => {
              const qNum = 31 + i;
              const displayNum = i + 1;
              const isActive = activeQuestion === qNum;
              // 실시간 입력값 우선 표시 로직
              const displayValue = isActive
                ? tempSubjectiveValue
                : (markedAnswers[qNum] as string);

              return (
                <div
                  key={qNum}
                  className="flex-1 flex border-b-[1.5px] border-[#5784f1] last:border-b-0"
                >
                  <div className="w-7 h-full bg-[#5784f1]/20 border-r-[1.5px] border-[#5784f1] flex items-center justify-center text-[#364f8e] text-[13px] font-bold">
                    {displayNum}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectSubjective(qNum)}
                    className={`flex-1 flex items-center justify-center text-[14px] transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#5784f1]/10 outline-[2.5px] outline-[#5784f1] outline-offset-[-2.5px]"
                        : "active:bg-gs-5"
                    } ${displayValue ? "text-gs-1 font-bold" : "text-[#bdbcb8]"}`}
                  >
                    {displayValue || "터치해서 주관식 답안 입력"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 타이밍 마크 */}
      <div className="w-[1214px] h-[26px] flex items-center text-[#858585] text-[12px]">
        <div className="w-[222px] flex items-center pl-[214px] shrink-0">
          <BlackMark />
        </div>
        <div className="flex items-center justify-center gap-[22px] ml-7 shrink-0">
          <BlackMark />
          <BlackMark />
        </div>
        <div className="w-[184px] flex items-center gap-[22px] pl-[56px] shrink-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <BlackMark key={i} />
          ))}
        </div>
        <div className="w-[184px] flex items-center gap-[22px] pl-[56px] shrink-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <BlackMark key={i} />
          ))}
        </div>
        <div className="w-[184px] flex items-center gap-[22px] pl-[56px] shrink-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <BlackMark key={i} />
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center font-medium opacity-80 shrink-0 ml-10">
          선 아래부분은 절대 칠하지 말 것.
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex h-10 w-[200px] border-[#5784f1] border-r-[1.5px] border-b-[1.5px]">
      <div className="w-7 h-full flex items-center justify-center border-r-[1.5px] border-[#5784f1] shrink-0">
        <span className="text-[#364f8e] text-[13px] font-bold leading-[1.2] whitespace-pre-wrap text-center">
          {label.split(" ").join("\n")}
        </span>
      </div>
      <div className="flex-1 h-full flex items-center px-3 bg-white">
        <span className="text-[#364f8e] text-[14px] font-bold truncate">
          {value ?? ""}
        </span>
      </div>
    </div>
  );
}

function MarkingButton({
  value,
  selected,
  onClick,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-5 h-[44px] rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
        selected
          ? "bg-[#090909] text-white scale-105 shadow-md"
          : "bg-[#a5a4a0] text-white hover:bg-gs-3"
      }`}
    >
      {value}
    </button>
  );
}

function BlackMark() {
  return <div className="w-2 h-6 bg-gs-1 shrink-0" />;
}
