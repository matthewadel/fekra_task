import i18n from '../../i18n';

// english fonts
const Bold = 'Poppins-Bold';
const Medium = 'Poppins-Medium';
const SemiBold = 'Poppins-SemiBold';
const Regular = 'Poppins-Regular';
const Light = 'Poppins-Light';

// arabic fonts
const ARBold = 'Cairo-Bold';
const ARMedium = 'Cairo-Regular';
const ARSemiBold = 'Cairo-SemiBold';
const ARRegular = 'Cairo-Regular';
const ARLight = 'Cairo-Light';

export function FONT_FAMILY(
  fontType?: 'BOLD' | 'MEDIUM' | 'SEMIBOLD' | 'REGULAR' | 'LIGHT',
) {
  // english fonts
  if (i18n.language === 'ar') {
    if (fontType === 'MEDIUM') return ARMedium;
    else if (fontType === 'BOLD') return ARBold;
    else if (fontType === 'SEMIBOLD') return ARSemiBold;
    else if (fontType === 'LIGHT') return ARLight;
    else return ARRegular;
  }
  // arabic fonts
  else {
    if (fontType === 'MEDIUM') return Medium;
    else if (fontType === 'BOLD') return Bold;
    else if (fontType === 'SEMIBOLD') return SemiBold;
    else if (fontType === 'LIGHT') return Light;
    else return Regular;
  }
}
