import ConsultationForm from "../components/ConsultationForm";

export default function ConsultantPage() {

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
          {/* ─── Hình minh hoạ ─── */}
          <div className="flex w-full justify-center lg:w-5/12">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl" />
              <img
                src="/images/man-costumer-service.png"
                alt="Tư vấn khoá học"
                className="relative z-10 w-64 max-w-full drop-shadow-lg sm:w-80 md:w-96"
              />
            </div>
          </div>

          {/* ─── Form tư vấn ─── */}
          <div className="w-full lg:w-7/12">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </section>
  );
}