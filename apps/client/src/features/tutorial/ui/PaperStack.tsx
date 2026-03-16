interface PaperStackProps {
  small?: boolean;
}

const PAPERS = Array.from({ length: 6 }, (_, i) => i);

export function PaperStack({ small }: PaperStackProps) {
  const sizeClass = small ? "scale-[0.7] origin-center" : "scale-100";
  return (
    <div className={`relative ${sizeClass} h-[400px] w-[300px] shrink-0`}>
      {PAPERS.map((i) => (
        <div
          key={i}
          className="absolute bg-gs-6 border-[2px] border-gs-5 rounded-3 shadow-strong p-8 flex flex-col items-center gap-6"
          style={{
            zIndex: 6 - i,
            transform: `translate(${i * 8}px, ${-i * 8}px)`,
            width: "275px",
            height: "391px",
          }}
        >
          <div className="text-center font-bold text-gs-1 tracking-tighter shrink-0">
            <p className="text-[14px] text-gs-2 mb-1">실전 모의고사</p>
            <p className="text-[36px] leading-none text-gs-1">공통수학2</p>
          </div>
          <div className="flex gap-4 w-full justify-center flex-1 py-4">
            <div className="flex flex-col gap-6 w-20 shrink-0">
              <div className="bg-[#f0f0f0] h-14 rounded" />
              <div className="bg-[#f0f0f0] h-14 rounded" />
              <div className="bg-[#f0f0f0] h-14 rounded" />
            </div>
            <div className="bg-[#e5e5e5] w-0.5 h-full rounded" />
            <div className="flex flex-col gap-10 w-20 shrink-0">
              <div className="bg-[#f0f0f0] h-14 rounded" />
              <div className="bg-[#f0f0f0] h-14 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
