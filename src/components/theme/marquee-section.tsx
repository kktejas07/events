import { themeAssets } from "@/lib/theme-images";

export function MarqueeSection() {
  const items = ["marketing", "BUSINESS", "branding"];

  return (
    <div className="gt-marquee-section-2 fix">
      <div className="mycustom-marque">
        <div className="scrolling-wrap gt-style-3">
          {items.map((text) => (
            <div key={text} className="comm">
              <div></div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="" /> {text}
              </div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="" /> {text}
              </div>
              <div className="cmn-textslide">
                <img src={themeAssets.marquee.icon} alt="" /> {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
