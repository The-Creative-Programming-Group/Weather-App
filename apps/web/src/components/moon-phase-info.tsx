import type { IconType } from "react-icons";
import { useTranslation } from "next-i18next";
import {
  WiMoonAltFirstQuarter,
  WiMoonAltFull,
  WiMoonAltNew,
  WiMoonAltThirdQuarter,
  WiMoonAltWaningCrescent5,
  WiMoonAltWaningGibbous3,
  WiMoonAltWaxingCrescent2,
  WiMoonAltWaxingGibbous3,
} from "react-icons/wi";

import { activeCity$ } from "~/states";

export const MoonPhaseInfo = ({ moonPhaseCode }: { moonPhaseCode: number }) => {
  const { t: translationHome } = useTranslation("home");

  let MoonPhaseIcon: IconType | null = null;
  let moonPhaseName: string = translationHome("not available");

  const nothernHemisphere = activeCity$.coord.lat.get() > 0;

  switch (moonPhaseCode) {
    case 800:
      MoonPhaseIcon = WiMoonAltNew as IconType;
      moonPhaseName = translationHome("moon phase new moon");
      break;
    case 801:
      MoonPhaseIcon = WiMoonAltWaxingCrescent2 as IconType;
      if (nothernHemisphere) {
        moonPhaseName = translationHome("moon phase waxing crescent");
      } else {
        moonPhaseName = translationHome("moon phase waning crescent");
      }
      break;
    case 802:
      MoonPhaseIcon = WiMoonAltFirstQuarter as IconType;
      if (nothernHemisphere) {
        moonPhaseName = translationHome("moon phase first quarter");
      } else {
        moonPhaseName = translationHome("moon phase last quarter");
      }
      break;
    case 803:
      MoonPhaseIcon = WiMoonAltWaxingGibbous3 as IconType;
      if (nothernHemisphere) {
        moonPhaseName = translationHome("moon phase waxing gibbous");
      } else {
        moonPhaseName = translationHome("moon phase waning gibbous");
      }
      break;
    case 804:
      MoonPhaseIcon = WiMoonAltFull as IconType;
      moonPhaseName = translationHome("moon phase full moon");
      break;
    case 805:
      MoonPhaseIcon = WiMoonAltWaningGibbous3 as IconType;
      if (nothernHemisphere) {
        moonPhaseName = translationHome("moon phase waning gibbous");
      } else {
        moonPhaseName = translationHome("moon phase waxing gibbous");
      }
      break;
    case 806:
      MoonPhaseIcon = WiMoonAltThirdQuarter as IconType;
      if (nothernHemisphere) {
        moonPhaseName = translationHome("moon phase last quarter");
      } else {
        moonPhaseName = translationHome("moon phase first quarter");
      }
      break;
    case 807:
      MoonPhaseIcon = WiMoonAltWaningCrescent5 as IconType;
      if (nothernHemisphere) {
        moonPhaseName = translationHome("moon phase waning crescent");
      } else {
        moonPhaseName = translationHome("moon phase waxing crescent");
      }
      break;
  }

  return (
    <>
      {MoonPhaseIcon && <MoonPhaseIcon className="h-24 w-24" />}
      {moonPhaseName}
    </>
  );
};
