import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AgeIcon from 'react-native-vector-icons/Feather';
import GenderIcon from 'react-native-vector-icons/Feather';
import ProfessionIcon from 'react-native-vector-icons/Feather';
import LocalityIcon from 'react-native-vector-icons/Ionicons';
import CallIcon from 'react-native-vector-icons/Ionicons';
import EmailIcon from 'react-native-vector-icons/Fontisto';

import { COLORS, RADIUS, TYPOGRAPHY } from '../../../theme/theme';
import { moderateScale, spacing, shadows } from '../../../utils/responsive';

export interface RoommateType {
  user_id: number;
  userName: string;
  profile_image_uri: string;
  age: number;
  gender: string;
  profession: string;
  address: string;
  profession_Description: string;
  contactNo: string;
  email: string;
}

interface RoommateCardProps {
  item: RoommateType;
}

export const RoommateCard: React.FC<RoommateCardProps> = React.memo(({ item }) => {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = (emailId: string) => {
    Linking.openURL(`mailto:${emailId}`);
  };

  // Helper to parse locality safely
  const getLocalityString = () => {
    if (!item.address) return 'Not Specified';
    const localityList = item.address.split(' ').map(f => f.trim().replace(/,/g, ''));
    const filteredLocalityList = localityList.filter(Boolean);
    if (filteredLocalityList.length < 2) return item.address;

    const city = filteredLocalityList[filteredLocalityList.length - 1];
    const locality = filteredLocalityList[filteredLocalityList.length - 2];
    return `${locality}, ${city}`;
  };

  return (
    <View style={styles.card}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: item.profile_image_uri }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{item.userName}</Text>
          <Text style={styles.userId}>User ID - {item.user_id}</Text>
        </View>
      </View>

      {/* Grid Badges: Age & Gender */}
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: '#B2EBF2' }]}>
          <AgeIcon
            name="calendar"
            size={moderateScale(18)}
            color="#1E88E5"
            style={styles.badgeIcon}
          />
          <View style={styles.badgeTextContainer}>
            <Text style={styles.badgeLabel}>Age</Text>
            <Text style={styles.badgeValue}>{item.age}</Text>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: '#F8BBD0' }]}>
          <GenderIcon
            name="users"
            size={moderateScale(18)}
            color="#C2185B"
            style={styles.badgeIcon}
          />
          <View style={styles.badgeTextContainer}>
            <Text style={styles.badgeLabel}>Gender</Text>
            <Text style={styles.badgeValue}>{item.gender}</Text>
          </View>
        </View>
      </View>

      {/* Grid Badges: Profession & Locality */}
      <View style={styles.fullBadgeContainer}>
        <View style={[styles.fullBadge, { backgroundColor: '#FFECB3' }]}>
          <ProfessionIcon
            name="briefcase"
            size={moderateScale(18)}
            color="#B45309"
            style={styles.badgeIcon}
          />
          <View style={styles.badgeTextContainer}>
            <Text style={styles.badgeLabel}>Profession</Text>
            <Text style={styles.badgeValue}>{item.profession}</Text>
          </View>
        </View>
      </View>

      <View style={styles.fullBadgeContainer}>
        <View style={[styles.fullBadge, { backgroundColor: '#D1FAE5' }]}>
          <LocalityIcon
            name="location-outline"
            size={moderateScale(18)}
            color="#047857"
            style={styles.badgeIcon}
          />
          <View style={styles.badgeTextContainer}>
            <Text style={styles.badgeLabel}>Locality</Text>
            <Text style={styles.badgeValue} numberOfLines={1}>
              {getLocalityString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Biography Description */}
      <Text style={styles.bioText} numberOfLines={3}>
        I am Engineering student at {item.profession_Description}
      </Text>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={styles.actionBtn}
          onPress={() => handleCall(item.contactNo)}
          accessibilityRole="button"
          accessibilityLabel="Call roommate"
        >
          <CallIcon name="call-outline" size={moderateScale(20)} color={COLORS.white} />
          <Text style={styles.actionBtnText}>Call</Text>
        </Pressable>

        <Pressable
          style={styles.actionBtn}
          onPress={() => handleEmail(item.email)}
          accessibilityRole="button"
          accessibilityLabel="Email roommate"
        >
          <EmailIcon name="email" size={moderateScale(20)} color={COLORS.white} />
          <Text style={styles.actionBtnText}>Email</Text>
        </Pressable>
      </View>
    </View>
  );
});

RoommateCard.displayName = 'RoommateCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    borderRadius: RADIUS.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileImage: {
    height: moderateScale(60),
    width: moderateScale(60),
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.greyLight,
  },
  headerText: {
    flex: 1,
    gap: moderateScale(2),
  },
  name: {
    ...TYPOGRAPHY.h3,
    fontSize: moderateScale(18),
  },
  userId: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  badge: {
    flex: 1,
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  fullBadgeContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  fullBadge: {
    flex: 1,
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  badgeIcon: {
    marginRight: spacing.sm,
  },
  badgeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  badgeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontWeight: '300',
  },
  badgeValue: {
    ...TYPOGRAPHY.body,
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  bioText: {
    ...TYPOGRAPHY.bodyLight,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    lineHeight: moderateScale(20),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: moderateScale(12),
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.white,
  },
});
