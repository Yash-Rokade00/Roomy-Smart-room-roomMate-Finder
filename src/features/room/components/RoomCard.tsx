import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LocationIcon from 'react-native-vector-icons/Ionicons';
import ParkingIcon from 'react-native-vector-icons/FontAwesome6';
import WifiIcon from 'react-native-vector-icons/Feather';
import TvIcon from 'react-native-vector-icons/Feather';
import FurnishedIcon from 'react-native-vector-icons/Ionicons';

import { COLORS, RADIUS, TYPOGRAPHY } from '../../../theme/theme';
import { moderateScale, spacing, shadows } from '../../../utils/responsive';

export interface RoomType {
  roomId: number;
  image: string;
  Locality: string;
  city: string;
  roomType: string;
  MonthlyRent: number;
  roomFacilities: string;
}

interface RoomCardProps {
  item: RoomType;
  onViewDetails: (roomId: number) => void;
}

export const RoomCard: React.FC<RoomCardProps> = React.memo(({ item, onViewDetails }) => {
  const facilitiesArray = item.roomFacilities
    ? item.roomFacilities.split(',').map(f => f.trim())
    : [];

  const hasWifi = facilitiesArray.includes('Wifi');
  const hasTv = facilitiesArray.includes('TV');
  const hasParking = facilitiesArray.includes('Parking');
  const hasFurnished = facilitiesArray.includes('Furnished');

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      
      <View style={styles.cardContent}>
        {/* Locality & Type Header */}
        <View style={styles.headerRow}>
          <View style={styles.locationContainer}>
            <LocationIcon
              name="location-outline"
              size={moderateScale(20)}
              color={COLORS.primary}
            />
            <Text style={styles.localityText} numberOfLines={1}>
              {item.Locality}
            </Text>
          </View>
          <Text style={styles.roomTypeBadge}>{item.roomType}</Text>
        </View>

        {/* Rent Display */}
        <View style={styles.rentContainer}>
          <Text style={styles.rupeeSymbol}>₹ </Text>
          <Text style={styles.rentValue}>{item.MonthlyRent}</Text>
          <Text style={styles.rentUnit}>/month</Text>
        </View>

        {/* Facilities Badges Row */}
        <View style={styles.facilitiesRow}>
          <View style={styles.facilityItem}>
            <WifiIcon
              name="wifi"
              size={moderateScale(16)}
              color={hasWifi ? COLORS.success : COLORS.textMuted}
            />
            <Text style={[styles.facilityText, hasWifi ? styles.facilityActive : styles.facilityInactive]}>
              Wifi
            </Text>
          </View>

          <View style={styles.facilityItem}>
            <TvIcon
              name="tv"
              size={moderateScale(15)}
              color={hasTv ? COLORS.success : COLORS.textMuted}
            />
            <Text style={[styles.facilityText, hasTv ? styles.facilityActive : styles.facilityInactive]}>
              TV
            </Text>
          </View>

          <View style={styles.facilityItem}>
            <ParkingIcon
              name="car-side"
              size={moderateScale(15)}
              color={hasParking ? COLORS.success : COLORS.textMuted}
            />
            <Text style={[styles.facilityText, hasParking ? styles.facilityActive : styles.facilityInactive]}>
              Parking
            </Text>
          </View>

          <View style={styles.facilityItem}>
            <FurnishedIcon
              name="bed-outline"
              size={moderateScale(18)}
              color={hasFurnished ? COLORS.success : COLORS.textMuted}
            />
            <Text style={[styles.facilityText, hasFurnished ? styles.facilityActive : styles.facilityInactive]}>
              Furnished
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* View Details Call to Action */}
        <Pressable
          style={({ pressed }) => [
            styles.detailsBtn,
            pressed && styles.pressedBtn,
          ]}
          onPress={() => onViewDetails(item.roomId)}
          accessibilityRole="button"
          accessibilityLabel="View room details"
        >
          <Text style={styles.detailsBtnText}>View More Details</Text>
        </Pressable>
      </View>
    </View>
  );
});

RoomCard.displayName = 'RoomCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    width: '90%',
    borderRadius: RADIUS.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardImage: {
    height: moderateScale(190),
    width: '100%',
    backgroundColor: COLORS.greyLight,
  },
  cardContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  localityText: {
    ...TYPOGRAPHY.h3,
    fontSize: moderateScale(17),
    flex: 1,
  },
  roomTypeBadge: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.secondaryLight,
    backgroundColor: COLORS.background,
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  rentContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rupeeSymbol: {
    ...TYPOGRAPHY.h2,
    fontSize: moderateScale(22),
    color: COLORS.text,
  },
  rentValue: {
    ...TYPOGRAPHY.h2,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  rentUnit: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginLeft: moderateScale(4),
  },
  facilitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  facilityText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  facilityActive: {
    color: COLORS.success,
  },
  facilityInactive: {
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
    marginVertical: spacing.xs,
  },
  detailsBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  pressedBtn: {
    opacity: 0.9,
  },
  detailsBtnText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.white,
  },
});
