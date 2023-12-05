use core::{
    array::ArrayTrait,
    integer::{u8_overflowing_add, u16_overflowing_add, u16_overflowing_sub, u256_try_as_non_zero},
    option::OptionTrait, poseidon::poseidon_hash_span, result::ResultTrait,
    starknet::{StorePacking}, traits::{TryInto, Into}
};

// use super::{
//     item_meta::{ItemSpecials, ItemSpecialsStorage, ImplItemSpecials}, adventurer_stats::Stats,
//     item_primitive::ItemPrimitive, adventurer_utils::{AdventurerUtils}, exploration::ExploreUtils,
//     bag::{Bag, IBag, ImplBag},
//
// };

use lootitems::{
    loot::{Loot, ILoot, ImplLoot},
    constants::{ItemSuffix, ItemId, NamePrefixLength, NameSuffixLength},
};
use combat::{
    combat::{ImplCombat, CombatSpec, SpecialPowers}, constants::CombatEnums::{Type, Tier, Slot},
};
use obstacles::obstacle::{ImplObstacle, Obstacle};
use beasts::{beast::{ImplBeast, Beast}, constants::BeastSettings};

const U128_MAX: u128 = 340282366920938463463374607431768211455;
const TWO_POW_1: u256 = 0x2; // 2^1
const TWO_POW_2: u256 = 0x4; // 2^2
const TWO_POW_3: u256 = 0x8; // 2^3
const TWO_POW_4: u256 = 0x10; // 2^4
const TWO_POW_5: u256 = 0x20; // 2^5
const TWO_POW_6: u256 = 0x40; // 2^6
const TWO_POW_7: u256 = 0x80; // 2^7
const TWO_POW_8: u256 = 0x100; // 2^8
const TWO_POW_9: u256 = 0x200; // 2^9
const TWO_POW_10: u256 = 0x400; // 2^10
const TWO_POW_11: u256 = 0x800; // 2^11
const TWO_POW_12: u256 = 0x1000; // 2^12
const TWO_POW_13: u256 = 0x2000; // 2^13
const TWO_POW_14: u256 = 0x4000; // 2^14
const TWO_POW_15: u256 = 0x8000; // 2^15
const TWO_POW_16: u256 = 0x10000; // 2^16
const TWO_POW_17: u256 = 0x20000; // 2^17
const TWO_POW_18: u256 = 0x40000; // 2^18
const TWO_POW_19: u256 = 0x80000; // 2^19
const TWO_POW_20: u256 = 0x100000; // 2^20
const TWO_POW_21: u256 = 0x200000; // 2^21
const TWO_POW_22: u256 = 0x400000; // 2^22
const TWO_POW_23: u256 = 0x800000; // 2^23
const TWO_POW_24: u256 = 0x1000000; // 2^24
const TWO_POW_25: u256 = 0x2000000; // 2^25
const TWO_POW_26: u256 = 0x4000000; // 2^26
const TWO_POW_27: u256 = 0x8000000; // 2^27
const TWO_POW_28: u256 = 0x10000000; // 2^28
const TWO_POW_29: u256 = 0x20000000; // 2^29
const TWO_POW_30: u256 = 0x40000000; // 2^30
const TWO_POW_31: u256 = 0x80000000; // 2^31
const TWO_POW_32: u256 = 0x100000000; // 2^32
const TWO_POW_33: u256 = 0x200000000; // 2^33
const TWO_POW_34: u256 = 0x400000000; // 2^34
const TWO_POW_35: u256 = 0x800000000; // 2^35
const TWO_POW_36: u256 = 0x1000000000; // 2^36
const TWO_POW_37: u256 = 0x2000000000; // 2^37
const TWO_POW_38: u256 = 0x4000000000; // 2^38
const TWO_POW_39: u256 = 0x8000000000; // 2^39
const TWO_POW_40: u256 = 0x10000000000; // 2^40
const TWO_POW_41: u256 = 0x20000000000; // 2^41
const TWO_POW_42: u256 = 0x40000000000; // 2^42
const TWO_POW_43: u256 = 0x80000000000; // 2^43
const TWO_POW_44: u256 = 0x100000000000; // 2^44
const TWO_POW_45: u256 = 0x200000000000; // 2^45
const TWO_POW_46: u256 = 0x400000000000; // 2^46
const TWO_POW_47: u256 = 0x800000000000; // 2^47
const TWO_POW_48: u256 = 0x1000000000000; // 2^48
const TWO_POW_49: u256 = 0x2000000000000; // 2^49
const TWO_POW_50: u256 = 0x4000000000000; // 2^50
const TWO_POW_51: u256 = 0x8000000000000; // 2^51
const TWO_POW_52: u256 = 0x10000000000000; // 2^52
const TWO_POW_53: u256 = 0x20000000000000; // 2^53
const TWO_POW_54: u256 = 0x40000000000000; // 2^54
const TWO_POW_55: u256 = 0x80000000000000; // 2^55
const TWO_POW_56: u256 = 0x100000000000000; // 2^56
const TWO_POW_57: u256 = 0x200000000000000; // 2^57
const TWO_POW_58: u256 = 0x400000000000000; // 2^58
const TWO_POW_59: u256 = 0x800000000000000; // 2^59
const TWO_POW_60: u256 = 0x1000000000000000; // 2^60
const TWO_POW_61: u256 = 0x2000000000000000; // 2^61
const TWO_POW_62: u256 = 0x4000000000000000; // 2^62
const TWO_POW_63: u256 = 0x8000000000000000; // 2^63
const TWO_POW_64: u256 = 0x10000000000000000; // 2^64
const TWO_POW_65: u256 = 0x20000000000000000; // 2^65
const TWO_POW_66: u256 = 0x40000000000000000; // 2^66
const TWO_POW_67: u256 = 0x80000000000000000; // 2^67
const TWO_POW_68: u256 = 0x100000000000000000; // 2^68
const TWO_POW_69: u256 = 0x200000000000000000; // 2^69
const TWO_POW_70: u256 = 0x400000000000000000; // 2^70
const TWO_POW_71: u256 = 0x800000000000000000; // 2^71
const TWO_POW_72: u256 = 0x1000000000000000000; // 2^72
const TWO_POW_73: u256 = 0x2000000000000000000; // 2^73
const TWO_POW_74: u256 = 0x4000000000000000000; // 2^74
const TWO_POW_75: u256 = 0x8000000000000000000; // 2^75
const TWO_POW_76: u256 = 0x10000000000000000000; // 2^76
const TWO_POW_77: u256 = 0x20000000000000000000; // 2^77
const TWO_POW_78: u256 = 0x40000000000000000000; // 2^78
const TWO_POW_79: u256 = 0x80000000000000000000; // 2^79
const TWO_POW_80: u256 = 0x100000000000000000000; // 2^80
const TWO_POW_81: u256 = 0x200000000000000000000; // 2^81
const TWO_POW_82: u256 = 0x400000000000000000000; // 2^82
const TWO_POW_83: u256 = 0x800000000000000000000; // 2^83
const TWO_POW_84: u256 = 0x1000000000000000000000; // 2^84
const TWO_POW_85: u256 = 0x2000000000000000000000; // 2^85
const TWO_POW_86: u256 = 0x4000000000000000000000; // 2^86
const TWO_POW_87: u256 = 0x8000000000000000000000; // 2^87
const TWO_POW_88: u256 = 0x10000000000000000000000; // 2^88
const TWO_POW_89: u256 = 0x20000000000000000000000; // 2^89
const TWO_POW_90: u256 = 0x40000000000000000000000; // 2^90
const TWO_POW_91: u256 = 0x80000000000000000000000; // 2^91
const TWO_POW_92: u256 = 0x100000000000000000000000; // 2^92
const TWO_POW_93: u256 = 0x200000000000000000000000; // 2^93
const TWO_POW_94: u256 = 0x400000000000000000000000; // 2^94
const TWO_POW_95: u256 = 0x800000000000000000000000; // 2^95
const TWO_POW_96: u256 = 0x1000000000000000000000000; // 2^96
const TWO_POW_97: u256 = 0x2000000000000000000000000; // 2^97
const TWO_POW_98: u256 = 0x4000000000000000000000000; // 2^98
const TWO_POW_99: u256 = 0x8000000000000000000000000; // 2^99
const TWO_POW_100: u256 = 0x10000000000000000000000000; // 2^100
const TWO_POW_101: u256 = 0x20000000000000000000000000; // 2^101
const TWO_POW_102: u256 = 0x40000000000000000000000000; // 2^102
const TWO_POW_103: u256 = 0x80000000000000000000000000; // 2^103
const TWO_POW_104: u256 = 0x100000000000000000000000000; // 2^104
const TWO_POW_105: u256 = 0x200000000000000000000000000; // 2^105
const TWO_POW_106: u256 = 0x400000000000000000000000000; // 2^106
const TWO_POW_107: u256 = 0x800000000000000000000000000; // 2^107
const TWO_POW_108: u256 = 0x1000000000000000000000000000; // 2^108
const TWO_POW_109: u256 = 0x2000000000000000000000000000; // 2^109
const TWO_POW_110: u256 = 0x4000000000000000000000000000; // 2^110
const TWO_POW_111: u256 = 0x8000000000000000000000000000; // 2^111
const TWO_POW_112: u256 = 0x10000000000000000000000000000; // 2^112
const TWO_POW_113: u256 = 0x20000000000000000000000000000; // 2^113
const TWO_POW_114: u256 = 0x40000000000000000000000000000; // 2^114
const TWO_POW_115: u256 = 0x80000000000000000000000000000; // 2^115
const TWO_POW_116: u256 = 0x100000000000000000000000000000; // 2^116
const TWO_POW_117: u256 = 0x200000000000000000000000000000; // 2^117
const TWO_POW_118: u256 = 0x400000000000000000000000000000; // 2^118
const TWO_POW_119: u256 = 0x800000000000000000000000000000; // 2^119
const TWO_POW_120: u256 = 0x1000000000000000000000000000000; // 2^120
const TWO_POW_121: u256 = 0x2000000000000000000000000000000; // 2^121
const TWO_POW_122: u256 = 0x4000000000000000000000000000000; // 2^122
const TWO_POW_123: u256 = 0x8000000000000000000000000000000; // 2^123
const TWO_POW_124: u256 = 0x10000000000000000000000000000000; // 2^124
const TWO_POW_125: u256 = 0x20000000000000000000000000000000; // 2^125
const TWO_POW_126: u256 = 0x40000000000000000000000000000000; // 2^126
const TWO_POW_127: u256 = 0x80000000000000000000000000000000; // 2^127
const TWO_POW_128: u256 = 0x100000000000000000000000000000000; // 2^128
const TWO_POW_129: u256 = 0x200000000000000000000000000000000; // 2^129
const TWO_POW_130: u256 = 0x400000000000000000000000000000000; // 2^130
const TWO_POW_131: u256 = 0x800000000000000000000000000000000; // 2^131
const TWO_POW_132: u256 = 0x1000000000000000000000000000000000; // 2^132
const TWO_POW_133: u256 = 0x2000000000000000000000000000000000; // 2^133
const TWO_POW_134: u256 = 0x4000000000000000000000000000000000; // 2^134
const TWO_POW_135: u256 = 0x8000000000000000000000000000000000; // 2^135
const TWO_POW_136: u256 = 0x10000000000000000000000000000000000; // 2^136
const TWO_POW_137: u256 = 0x20000000000000000000000000000000000; // 2^137
const TWO_POW_138: u256 = 0x40000000000000000000000000000000000; // 2^138
const TWO_POW_139: u256 = 0x80000000000000000000000000000000000; // 2^139
const TWO_POW_140: u256 = 0x100000000000000000000000000000000000; // 2^140
const TWO_POW_141: u256 = 0x200000000000000000000000000000000000; // 2^141
const TWO_POW_142: u256 = 0x400000000000000000000000000000000000; // 2^142
const TWO_POW_143: u256 = 0x800000000000000000000000000000000000; // 2^143
const TWO_POW_144: u256 = 0x1000000000000000000000000000000000000; // 2^144
const TWO_POW_145: u256 = 0x2000000000000000000000000000000000000; // 2^145
const TWO_POW_146: u256 = 0x4000000000000000000000000000000000000; // 2^146
const TWO_POW_147: u256 = 0x8000000000000000000000000000000000000; // 2^147
const TWO_POW_148: u256 = 0x10000000000000000000000000000000000000; // 2^148
const TWO_POW_149: u256 = 0x20000000000000000000000000000000000000; // 2^149
const TWO_POW_150: u256 = 0x40000000000000000000000000000000000000; // 2^150
const TWO_POW_151: u256 = 0x80000000000000000000000000000000000000; // 2^151
const TWO_POW_152: u256 = 0x100000000000000000000000000000000000000; // 2^152
const TWO_POW_153: u256 = 0x200000000000000000000000000000000000000; // 2^153
const TWO_POW_154: u256 = 0x400000000000000000000000000000000000000; // 2^154
const TWO_POW_155: u256 = 0x800000000000000000000000000000000000000; // 2^155
const TWO_POW_156: u256 = 0x1000000000000000000000000000000000000000; // 2^156
const TWO_POW_157: u256 = 0x2000000000000000000000000000000000000000; // 2^157
const TWO_POW_158: u256 = 0x4000000000000000000000000000000000000000; // 2^158
const TWO_POW_159: u256 = 0x8000000000000000000000000000000000000000; // 2^159
const TWO_POW_160: u256 = 0x10000000000000000000000000000000000000000; // 2^160
const TWO_POW_161: u256 = 0x20000000000000000000000000000000000000000; // 2^161
const TWO_POW_162: u256 = 0x40000000000000000000000000000000000000000; // 2^162
const TWO_POW_163: u256 = 0x80000000000000000000000000000000000000000; // 2^163
const TWO_POW_164: u256 = 0x100000000000000000000000000000000000000000; // 2^164
const TWO_POW_165: u256 = 0x200000000000000000000000000000000000000000; // 2^165
const TWO_POW_166: u256 = 0x400000000000000000000000000000000000000000; // 2^166
const TWO_POW_167: u256 = 0x800000000000000000000000000000000000000000; // 2^167
const TWO_POW_168: u256 = 0x1000000000000000000000000000000000000000000; // 2^168
const TWO_POW_169: u256 = 0x2000000000000000000000000000000000000000000; // 2^169
const TWO_POW_170: u256 = 0x4000000000000000000000000000000000000000000; // 2^170
const TWO_POW_171: u256 = 0x8000000000000000000000000000000000000000000; // 2^171
const TWO_POW_172: u256 = 0x10000000000000000000000000000000000000000000; // 2^172
const TWO_POW_173: u256 = 0x20000000000000000000000000000000000000000000; // 2^173
const TWO_POW_174: u256 = 0x40000000000000000000000000000000000000000000; // 2^174
const TWO_POW_175: u256 = 0x80000000000000000000000000000000000000000000; // 2^175
const TWO_POW_176: u256 = 0x100000000000000000000000000000000000000000000; // 2^176
const TWO_POW_177: u256 = 0x200000000000000000000000000000000000000000000; // 2^177
const TWO_POW_178: u256 = 0x400000000000000000000000000000000000000000000; // 2^178
const TWO_POW_179: u256 = 0x800000000000000000000000000000000000000000000; // 2^179
const TWO_POW_180: u256 = 0x1000000000000000000000000000000000000000000000; // 2^180
const TWO_POW_181: u256 = 0x2000000000000000000000000000000000000000000000; // 2^181
const TWO_POW_182: u256 = 0x4000000000000000000000000000000000000000000000; // 2^182
const TWO_POW_183: u256 = 0x8000000000000000000000000000000000000000000000; // 2^183
const TWO_POW_184: u256 = 0x10000000000000000000000000000000000000000000000; // 2^184
const TWO_POW_185: u256 = 0x20000000000000000000000000000000000000000000000; // 2^185
const TWO_POW_186: u256 = 0x40000000000000000000000000000000000000000000000; // 2^186
const TWO_POW_187: u256 = 0x80000000000000000000000000000000000000000000000; // 2^187
const TWO_POW_188: u256 = 0x100000000000000000000000000000000000000000000000; // 2^188
const TWO_POW_189: u256 = 0x200000000000000000000000000000000000000000000000; // 2^189
const TWO_POW_190: u256 = 0x400000000000000000000000000000000000000000000000; // 2^190
const TWO_POW_191: u256 = 0x800000000000000000000000000000000000000000000000; // 2^191
const TWO_POW_192: u256 = 0x1000000000000000000000000000000000000000000000000; // 2^192
const TWO_POW_193: u256 = 0x2000000000000000000000000000000000000000000000000; // 2^193
const TWO_POW_194: u256 = 0x4000000000000000000000000000000000000000000000000; // 2^194
const TWO_POW_195: u256 = 0x8000000000000000000000000000000000000000000000000; // 2^195
const TWO_POW_196: u256 = 0x10000000000000000000000000000000000000000000000000; // 2^196
const TWO_POW_197: u256 = 0x20000000000000000000000000000000000000000000000000; // 2^197
const TWO_POW_198: u256 = 0x40000000000000000000000000000000000000000000000000; // 2^198
const TWO_POW_199: u256 = 0x80000000000000000000000000000000000000000000000000; // 2^199
const TWO_POW_200: u256 = 0x100000000000000000000000000000000000000000000000000; // 2^200
const TWO_POW_201: u256 = 0x200000000000000000000000000000000000000000000000000; // 2^201
const TWO_POW_202: u256 = 0x400000000000000000000000000000000000000000000000000; // 2^202
const TWO_POW_203: u256 = 0x800000000000000000000000000000000000000000000000000; // 2^203
const TWO_POW_204: u256 = 0x1000000000000000000000000000000000000000000000000000; // 2^204
const TWO_POW_205: u256 = 0x2000000000000000000000000000000000000000000000000000; // 2^205
const TWO_POW_206: u256 = 0x4000000000000000000000000000000000000000000000000000; // 2^206
const TWO_POW_207: u256 = 0x8000000000000000000000000000000000000000000000000000; // 2^207
const TWO_POW_208: u256 = 0x10000000000000000000000000000000000000000000000000000; // 2^208
const TWO_POW_209: u256 = 0x20000000000000000000000000000000000000000000000000000; // 2^209
const TWO_POW_210: u256 = 0x40000000000000000000000000000000000000000000000000000; // 2^210
const TWO_POW_211: u256 = 0x80000000000000000000000000000000000000000000000000000; // 2^211
const TWO_POW_212: u256 = 0x100000000000000000000000000000000000000000000000000000; // 2^212
const TWO_POW_213: u256 = 0x200000000000000000000000000000000000000000000000000000; // 2^213
const TWO_POW_214: u256 = 0x400000000000000000000000000000000000000000000000000000; // 2^214
const TWO_POW_215: u256 = 0x800000000000000000000000000000000000000000000000000000; // 2^215
const TWO_POW_216: u256 = 0x1000000000000000000000000000000000000000000000000000000; // 2^216
const TWO_POW_217: u256 = 0x2000000000000000000000000000000000000000000000000000000; // 2^217
const TWO_POW_218: u256 = 0x4000000000000000000000000000000000000000000000000000000; // 2^218
const TWO_POW_219: u256 = 0x8000000000000000000000000000000000000000000000000000000; // 2^219
const TWO_POW_220: u256 = 0x10000000000000000000000000000000000000000000000000000000; // 2^220
const TWO_POW_221: u256 = 0x20000000000000000000000000000000000000000000000000000000; // 2^221
const TWO_POW_222: u256 = 0x40000000000000000000000000000000000000000000000000000000; // 2^222
const TWO_POW_223: u256 = 0x80000000000000000000000000000000000000000000000000000000; // 2^223
const TWO_POW_224: u256 = 0x100000000000000000000000000000000000000000000000000000000; // 2^224
const TWO_POW_225: u256 = 0x200000000000000000000000000000000000000000000000000000000; // 2^225
const TWO_POW_226: u256 = 0x400000000000000000000000000000000000000000000000000000000; // 2^226
const TWO_POW_227: u256 = 0x800000000000000000000000000000000000000000000000000000000; // 2^227
const TWO_POW_228: u256 = 0x1000000000000000000000000000000000000000000000000000000000; // 2^228
const TWO_POW_229: u256 = 0x2000000000000000000000000000000000000000000000000000000000; // 2^229
const TWO_POW_230: u256 = 0x4000000000000000000000000000000000000000000000000000000000; // 2^230
const TWO_POW_231: u256 = 0x8000000000000000000000000000000000000000000000000000000000; // 2^231
const TWO_POW_232: u256 =
    0x10000000000000000000000000000000000000000000000000000000000; // 2^232
const TWO_POW_233: u256 =
    0x20000000000000000000000000000000000000000000000000000000000; // 2^233
const TWO_POW_234: u256 =
    0x40000000000000000000000000000000000000000000000000000000000; // 2^234
const TWO_POW_235: u256 =
    0x80000000000000000000000000000000000000000000000000000000000; // 2^235
const TWO_POW_236: u256 =
    0x100000000000000000000000000000000000000000000000000000000000; // 2^236
const TWO_POW_237: u256 =
    0x200000000000000000000000000000000000000000000000000000000000; // 2^237
const TWO_POW_238: u256 =
    0x400000000000000000000000000000000000000000000000000000000000; // 2^238
const TWO_POW_239: u256 =
    0x800000000000000000000000000000000000000000000000000000000000; // 2^239
const TWO_POW_240: u256 =
    0x1000000000000000000000000000000000000000000000000000000000000; // 2^240
const TWO_POW_241: u256 =
    0x2000000000000000000000000000000000000000000000000000000000000; // 2^241
const TWO_POW_242: u256 =
    0x4000000000000000000000000000000000000000000000000000000000000; // 2^242
const TWO_POW_243: u256 =
    0x8000000000000000000000000000000000000000000000000000000000000; // 2^243
const TWO_POW_244: u256 =
    0x10000000000000000000000000000000000000000000000000000000000000; // 2^244
const TWO_POW_245: u256 =
    0x20000000000000000000000000000000000000000000000000000000000000; // 2^245
const TWO_POW_246: u256 =
    0x40000000000000000000000000000000000000000000000000000000000000; // 2^246
const TWO_POW_247: u256 =
    0x80000000000000000000000000000000000000000000000000000000000000; // 2^247
const TWO_POW_248: u256 =
    0x100000000000000000000000000000000000000000000000000000000000000; // 2^248
const TWO_POW_249: u256 =
    0x200000000000000000000000000000000000000000000000000000000000000; // 2^249
const TWO_POW_250: u256 =
    0x400000000000000000000000000000000000000000000000000000000000000; // 2^250
const TWO_POW_251: u256 =
    0x800000000000000000000000000000000000000000000000000000000000000; // 2^251
const TWO_POW_252: u256 =
    0x1000000000000000000000000000000000000000000000000000000000000000; // 2^252
const TWO_POW_256: u256 =
    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF; // 2^256

#[derive(Drop, Copy, Serde)]
struct CcCave {
    map_id:u16,//9 bits
    curr_beast:u16,
    cc_points:u16,
    beast_health:u16, // 9 bits
    beast_amount:u16,
    has_reward: u16, // 9 bits
    strength_increase: u8, // 9 bits
    dexterity_increase: u8, // 9 bits
    vitality_increase: u8, // 9 bits
    intelligence_increase: u8, // 9 bits
    wisdom_increase: u8, // 9 bits
    charisma_increase: u8, // 9 bits
}

impl CcCavePacking of StorePacking<CcCave,felt252> {
    fn pack(value: CcCave) -> felt252 {

        (value.map_id.into()
            + value.curr_beast.into() * TWO_POW_9
            + value.cc_points.into() * TWO_POW_18
            + value.beast_health.into() * TWO_POW_27
            + value.beast_amount.into() * TWO_POW_36
            + value.has_reward.into() * TWO_POW_45
            + value.strength_increase.into() * TWO_POW_54
            + value.dexterity_increase.into() * TWO_POW_63
            + value.vitality_increase.into() * TWO_POW_72
            + value.intelligence_increase.into() * TWO_POW_81
            + value.wisdom_increase.into() * TWO_POW_90
            + value.charisma_increase.into() * TWO_POW_99
        ).try_into().expect('pack cc_cave')
    }
    fn unpack(value: felt252) -> CcCave {
        let packed = value.into();
        let (packed, map_id) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, curr_beast) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, cc_points) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, beast_health) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, beast_amount) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, has_reward) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, strength_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, dexterity_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, vitality_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, intelligence_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, wisdom_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());
        let (packed, charisma_increase) = integer::U256DivRem::div_rem(packed, TWO_POW_9.try_into().unwrap());

        CcCave {
            map_id: map_id.try_into().expect('unpack cc_cave map_id'),
            curr_beast: curr_beast.try_into().expect('unpack cc_cave curr_beast'),
            cc_points: cc_points.try_into().expect('unpack cc_cave cc_points'),
            beast_health: beast_health.try_into().expect('unpack cc_cave beast_health'),
            beast_amount: beast_amount.try_into().expect('unpack cc_cave beast_amount'),
            has_reward: has_reward.try_into().expect('unpack cc_cave has_reward'),
            strength_increase: strength_increase.try_into().expect('unpack cc_cave strength'),
            dexterity_increase: dexterity_increase.try_into().expect('unpack cc_cave dexterity'),
            vitality_increase: vitality_increase.try_into().expect('unpack cc_cave vitality'),
            intelligence_increase: intelligence_increase.try_into().expect('unpack cc_cave intelligence'),
            wisdom_increase: wisdom_increase.try_into().expect('unpack cc_cave wisdom'),
            charisma_increase: charisma_increase.try_into().expect('unpack cc_cave charisma'),
        }
    }
}

#[generate_trait]
impl ImplCcCave of ICcCave {
    fn increase_strength(ref self: CcCave,amount:u8) -> u8{
        self.strength_increase = self.strength_increase + amount;
        self.strength_increase
    }

    fn increase_dexterity(ref self: CcCave,amount:u8) -> u8{
        self.dexterity_increase = self.dexterity_increase + amount;
        self.dexterity_increase
    }

    fn increase_vitality(ref self: CcCave,amount:u8) -> u8{
        self.vitality_increase = self.vitality_increase + amount;
        self.vitality_increase
    }

    fn increase_intelligence(ref self: CcCave,amount:u8) -> u8{
        self.intelligence_increase = self.intelligence_increase + amount;
        self.intelligence_increase
    }

    fn increase_wisdom(ref self: CcCave,amount:u8) -> u8{
        self.wisdom_increase = self.wisdom_increase + amount;
        self.wisdom_increase
    }

    fn increase_charisma(ref self: CcCave,amount:u8) -> u8{
        self.charisma_increase = self.charisma_increase + amount;
        self.charisma_increase
    }

    fn get_beast_amount(points: u16) -> u16 {
        // 怪物数量=(point点数 mod 4) + 3
        return (points % 4) + 3;
    }

    fn get_beast_level(self: CcCave, seed: u128) -> u16 {
        // 当points（0|3），randomNumber=3|5
        // 当points（3|8），randomNumber=2|5
        // 当points（8|12），randomNumber=1|4
        if self.cc_points < 3 {
            return 3 + (seed % 3).try_into().unwrap();
        } else if self.cc_points < 8 {
            return 2 + (seed % 4).try_into().unwrap();
        } else if self.cc_points < 12 {
            return 1 + (seed % 4).try_into().unwrap();
        } else {
            return 0;
        }
    }

    fn get_item_amount(self:CcCave, seed:u128)->u8{
        // 装备数量
        // 当points（0|3），randomNumber=0|2
        // 当points（3|5），randomNumber=1|2
        // 当points（5|8），randomNumber=1|3
        // 当points（8|11），randomNumber=2|3
        // 当points（12），randomNumber=3|5
        if self.cc_points < 3 {
            //return (seed % 3).try_into().unwrap();
            return 1+(seed % 3).try_into().unwrap();
        } else if self.cc_points < 5 {
            return 1 + (seed % 2).try_into().unwrap();
        } else if self.cc_points < 8 {
            return 1 + (seed % 3).try_into().unwrap();
        } else if self.cc_points < 11 {
            return 2 + (seed % 2).try_into().unwrap();
        } else {
            return 3 + (seed % 3).try_into().unwrap();
        }
    }

    fn get_item_level(self:CcCave,seed:u128)->u8{
        // points（0|3），randomNumber=5|4
        // 当points（3|5），randomNumber=5|3
        // 当points（5|8），randomNumber=4|2
        // 当points（8|11），randomNumber=4|1
        // 当points（12），randomNumber=3|1
        if self.cc_points < 3 {
            return 5 - (seed % 2).try_into().unwrap();
        } else if self.cc_points < 5 {
            return 5 - (seed % 3).try_into().unwrap();
        } else if self.cc_points < 8 {
            return 4 - (seed % 3).try_into().unwrap();
        } else if self.cc_points < 11 {
            return 4 - (seed % 2).try_into().unwrap();
        } else if self.cc_points < 12{
            return 3 - (seed % 2).try_into().unwrap();
        }

        return 0;
    }

    fn get_item_id(self:CcCave, level:u8 , seed:u128)->u8{
        if level == 1 {
            return self.get_item_id_t1(seed);
        }
        if level == 2 {
            return self.get_item_id_t2(seed);
        }
        if level == 3 {
           return self.get_item_id_t3(seed);
        }
        if level == 4 {
           return self.get_item_id_t4(seed);
        }
        if level == 5 {
           return self.get_item_id_t5(seed);
        }
        return 0;
    }

    fn get_item_id_t1(self:CcCave, seed:u128)->u8{
        // 1,2,3,6,7,8,9,13,17,27,32,37,42,47,52,57,62,67,72,77,82,87,92,97 => 25
        let selected=seed % 25;
        if selected == 0 {
            return 1;
        }else if selected == 2{
            return 2;
        }else if selected == 3{
            return 3;
        }else if selected == 6{
            return 6;
        }else if selected == 7{
            return 7;
        }else if selected == 8{
            return 8;
        } else if selected == 9 {
            return 9;
        } else if selected == 10{
            return 13;
        } else if selected == 11{
            return 17;
        } else if selected == 12{
            return 27;
        } else if selected == 13{
            return 32;
        } else if selected == 14{
            return 37;
        } else if selected == 15{
            return 42;
        } else if selected == 16{
            return 47;
        } else if selected == 17{
            return 52;
        } else if selected == 18{
            return 57;
        } else if selected == 19{
            return 62;
        } else if selected == 20{
            return 67;
        } else if selected == 21{
            return 72;
        } else if selected == 22{
            return 77;
        } else if selected == 23{
            return 82;
        } else if selected == 24{
            return 87;
        } else if selected == 25{
            return 92;
        } else if selected == 26{
            return 97;
        }

        return 0;
    }

    fn get_item_id_t2(self:CcCave, seed:u128)->u8{
        // 4,10,14,18,23,28,33,38,43,48,53,58,63,68,73,78,83,88,93,98 => 20

        let selected=seed % 20;
        if selected == 0 {
            return 4;
        }else if selected == 2{
            return 10;
        }else if selected == 3{
            return 14;
        }else if selected == 6{
            return 18;
        }else if selected == 7{
            return 23;
        }else if selected == 8{
            return 28;
        } else if selected == 9 {
            return 33;
        } else if selected == 10{
            return 38;
        } else if selected == 11{
            return 43;
        } else if selected == 12{
            return 48;
        } else if selected == 13{
            return 53;
        } else if selected == 14{
            return 58;
        } else if selected == 15{
            return 63;
        } else if selected == 16{
            return 68;
        } else if selected == 17{
            return 73;
        } else if selected == 18{
            return 78;
        } else if selected == 19{
            return 83;
        } else if selected == 20{
            return 88;
        } else if selected == 21{
            return 93;
        } else if selected == 22{
            return 98;
        }

        return 0;
    }

    fn get_item_id_t3(self:CcCave, seed:u128)->u8{
        // 5,11,15,19,24,29,34,39,44,49,54,59,64,69,74,79,84,89,94,99 => 20

        let selected=seed % 20;
        if selected == 0 {
            return 5;
        }else if selected == 2{
            return 11;
        }else if selected == 3{
            return 15;
        }else if selected == 6{
            return 19;
        }else if selected == 7{
            return 24;
        }else if selected == 8{
            return 29;
        } else if selected == 9 {
            return 34;
        } else if selected == 10{
            return 39;
        } else if selected == 11{
            return 44;
        } else if selected == 12{
            return 49;
        } else if selected == 13{
            return 54;
        } else if selected == 14{
            return 59;
        } else if selected == 15{
            return 64;
        } else if selected == 16{
            return 69;
        } else if selected == 17{
            return 74;
        } else if selected == 18{
            return 79;
        } else if selected == 19{
            return 84;
        } else if selected == 20{
            return 89;
        } else if selected == 21{
            return 94;
        } else if selected == 22{
            return 99;
        }

        return 0;
    }

    fn get_item_id_t4(self:CcCave, seed:u128)->u8{
        // 20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100 => 17

        let selected=seed % 17;
        if selected == 0 {
            return 20;
        }else if selected == 2{
            return 25;
        }else if selected == 3{
            return 30;
        }else if selected == 6{
            return 35;
        }else if selected == 7{
            return 40;
        }else if selected == 8{
            return 45;
        } else if selected == 9 {
            return 50;
        } else if selected == 10{
            return 55;
        } else if selected == 11{
            return 60;
        } else if selected == 12{
            return 65;
        } else if selected == 13{
            return 70;
        } else if selected == 14{
            return 75;
        } else if selected == 15{
            return 80;
        } else if selected == 16{
            return 85;
        } else if selected == 17{
            return 90;
        } else if selected == 18{
            return 95;
        } else if selected == 19{
            return 100;
        }

        return 0;
    }

    fn get_item_id_t5(self:CcCave, seed:u128)->u8{
        // 12,16,21,26,31,36,41,46,51,56,61,66,71,76,81,86,91,96,101 => 19

        let selected=seed % 19;
        if selected == 0 {
            return 12;
        }else if selected == 2{
            return 16;
        }else if selected == 3{
            return 21;
        }else if selected == 6{
            return 26;
        }else if selected == 7{
            return 31;
        }else if selected == 8{
            return 36;
        } else if selected == 9 {
            return 41;
        } else if selected == 10{
            return 46;
        } else if selected == 11{
            return 51;
        } else if selected == 12{
            return 56;
        } else if selected == 13{
            return 61;
        } else if selected == 14{
            return 66;
        } else if selected == 15{
            return 71;
        } else if selected == 16{
            return 76;
        } else if selected == 17{
            return 81;
        } else if selected == 18{
            return 86;
        } else if selected == 19{
            return 91;
        } else if selected == 20{
            return 96;
        } else if selected == 21{
            return 101;
        }

        return 0;
    }


    // Sets the beast's health to a specified amount, preventing overflow.
    // @param self: Adventurer to set beast health for
    // @param amount: Amount of health to set the beast's health to
    #[inline(always)]
    fn set_beast_health(ref self: CcCave, amount: u16) {
        // check for overflow
        // we currently use 9 bits for beast health so MAX HEALTH is 2^9 - 1
        if (amount > BeastSettings::MAXIMUM_HEALTH) {
            self.beast_health = BeastSettings::MAXIMUM_HEALTH;
        } else {
            self.beast_health = amount;
        }
    }

    // @notice get_beast_seed provides an entropy source that is fixed during battle
    // it intentionally does not use global_entropy as that could change during battle and this
    // entropy allows us to simulate a persistent battle without having to store beast
    // details on-chain.
    // @param self A reference to the Adventurer object which represents the adventurer.
    // @param adventurer_entropy A number used for randomization.
    // @return Returns a number used for generated a random beast.
    fn get_beast_seed(self: CcCave, adventurer_entropy: felt252) -> u128 {
        if self.map_id > 0 {
            let mut hash_span = ArrayTrait::new();
            hash_span.append(self.map_id.into());
            hash_span.append(self.curr_beast.into());
            hash_span.append(adventurer_entropy.into());
            let poseidon = poseidon_hash_span(hash_span.span());
            let (d, r) = integer::U256DivRem::div_rem(
                poseidon.into(), u256_try_as_non_zero(U128_MAX.into()).unwrap()
            );
            r.try_into().unwrap()
        } else {
            0
        }
    }

    fn get_reward_seed(self: CcCave, adventurer_entropy: u128,index:u8) -> u128 {
            let mut hash_span = ArrayTrait::new();
            hash_span.append(self.map_id.into());
            hash_span.append(self.curr_beast.into());
            hash_span.append(adventurer_entropy.into());
            hash_span.append(index.into());
            let poseidon = poseidon_hash_span(hash_span.span());
            let (d, r) = integer::U256DivRem::div_rem(
                poseidon.into(), u256_try_as_non_zero(U128_MAX.into()).unwrap()
            );
            r.try_into().unwrap()
    }

    fn get_buff_seed(self: CcCave, adventurer_entropy: felt252,index:u8) -> u16 {
        let mut hash_span = ArrayTrait::new();
        hash_span.append(self.map_id.into());
        hash_span.append(self.curr_beast.into());
        hash_span.append(adventurer_entropy.into());
        hash_span.append(index.into());
        let poseidon = poseidon_hash_span(hash_span.span());
        let (d, r) = integer::U256DivRem::div_rem(
            poseidon.into(), u256_try_as_non_zero(U128_MAX.into()).unwrap()
        );
        let seed:u128 = r.try_into().expect('get_buff_seed 1');

        return 1 + (seed % 6).try_into().expect('get_buff_seed 2');
    }

    fn get_beast(self: CcCave,adventurer_entropy: felt252) -> (Beast, u128) {
        let beast_seed = self.get_beast_seed(adventurer_entropy);
        let adventurer_level = 1;//self.get_level();

        // @dev ideally this would be a setting but to minimize gas we're using hardcoded value so we can use cheaper equal operator

        let beast_id = ImplBeast::get_beast_id(beast_seed);
        let starting_health = 1;//ImplBeast::get_starting_health(adventurer_level, beast_seed);
        let beast_tier = ImplBeast::get_tier(beast_id);
        let beast_type = ImplBeast::get_type(beast_id);
        let beast_level = self.get_beast_level(beast_seed);
        let mut special_names = SpecialPowers { special1: 0, special2: 0, special3: 0 };

        // if (beast_level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK) {
        //     special_names =
        //         ImplBeast::get_special_names(
        //             adventurer_level,
        //             beast_seed,
        //             NamePrefixLength.into(),
        //             NameSuffixLength.into(),
        //         );
        // }

        let beast = Beast {
            id: beast_id,
            starting_health: starting_health,
            combat_spec: CombatSpec {
                tier: beast_tier,
                item_type: beast_type,
                level: beast_level,
                specials: special_names,
            },
        };

        (beast, beast_seed)
    }


}


#[cfg(test)]
mod tests {
    use debug::PrintTrait;
    use cc::cc_cave::CcCave;
    use cc::cc_cave::ImplCcCave;
    use cc::cc_buff::get_buff_by_id;

    use pack::{pack::{Packing, rshift_split}, constants::{MASK_16, pow, MASK_8, MASK_BOOL, mask}};

    // #[test]
    // #[available_gas(555600)]
    // fn test_cc_get_beast() {
    //     cc_get_beast(1);
    // }

    fn get_beast_amount(seed: u16, points: u16) -> u16 {
        // 怪物数量=(point点数 mod 4) + 3
        return (points % 4) + 3;
    }

    fn get_beast_level(seed: u128, points: u16) -> u16 {
        // 当points（0|3），randomNumber=3|5
        // 当points（3|8），randomNumber=2|5
        // 当points（8|12），randomNumber=1|4
        if points < 3 {
            return 3 + (seed % 3).try_into().unwrap();
        } else if points < 8 {
            return 2 + (seed % 4).try_into().unwrap();
        } else if points < 12 {
            return 1 + (seed % 4).try_into().unwrap();
        } else {
            return 0;
        }
    }

    #[test]
    #[available_gas(555600)]
    fn test_get_beast_level() {
        let beast_level = get_beast_level(1, 3);
        beast_level.print();

        // let x = 12;
        // x.print();
    }

    #[test]
    #[available_gas(1555600)]
    fn test_pack() {
        let mut cc_cave = CcCave {
            map_id: 2,
            curr_beast: 1,
            cc_points: 0,
            beast_health: 1,
            beast_amount: 3,
            has_reward: 3,
            strength_increase: 0,
            dexterity_increase: 0,
            vitality_increase: 0,
            intelligence_increase: 0,
            wisdom_increase: 0,
            charisma_increase: 0,
        };
        let packed = cc_cave.pack();
        let unpacked:CcCave = Packing::unpack(packed);
        assert(unpacked.map_id==2,'');
        assert(unpacked.charisma_increase==0,'');

    }

    #[test]
    #[available_gas(1555600)]
    fn test_get_buff_sees() {
        let mut cc_cave = CcCave {
            map_id: 2,
            curr_beast: 1,
            cc_points: 0,
            beast_health: 1,
            beast_amount: 3,
            has_reward: 3,
            strength_increase: 0,
            dexterity_increase: 0,
            vitality_increase: 0,
            intelligence_increase: 0,
            wisdom_increase: 0,
            charisma_increase: 0,
        };
        let mut adventurer_entropy = 9004952233574142991;
        let seed_1 = cc_cave.get_buff_seed(adventurer_entropy, 1);
        seed_1.print();

        let config = get_buff_by_id(seed_1);
        cc_cave.increase_vitality(config.vitality);

        assert(cc_cave.vitality_increase == 1,'');
    }
}
