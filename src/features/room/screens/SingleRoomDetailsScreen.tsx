import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import ArrowLeftIcon from 'react-native-vector-icons/Feather';
import RupeeIcon from 'react-native-vector-icons/FontAwesome';
import ShieldIcon from 'react-native-vector-icons/Octicons';
import LocationIcon from 'react-native-vector-icons/Ionicons';
import ParkingIcon from 'react-native-vector-icons/FontAwesome6';
import WifiIcon from 'react-native-vector-icons/Feather';
import TvIcon from 'react-native-vector-icons/Feather';
import FurnishedIcon from 'react-native-vector-icons/Ionicons';
import GenderIcon from 'react-native-vector-icons/Feather';
import RulesIcon from 'react-native-vector-icons/MaterialIcons';
import DescriptionIcon from 'react-native-vector-icons/Feather';
import OwnerIcon from 'react-native-vector-icons/FontAwesome5';
import UserIcon from 'react-native-vector-icons/Feather';
import CallIcon from 'react-native-vector-icons/Ionicons';
import EmailIcon from 'react-native-vector-icons/Fontisto';
import EncryptedStorage from 'react-native-encrypted-storage';

import API from '../../../services/api/api';
import { COLORS, TYPOGRAPHY, RADIUS } from '../../../theme/theme';
import { deviceWidth, moderateScale, spacing, shadows } from '../../../utils/responsive';
import { Loader } from '../../../components/ui/Loader';

interface SingleRoomDetailsScreenProps {
  navigation: any;
  route: any;
}

interface RoomDetailBackend {
  roomId: number;
  Locality: string;
  city: string;
  roomType: string;
  MonthlyRent: number;
  SecurityDeposit: number;
  roomFacilities: string;
  Preferred_tenants: string;
  FullAddress: string;
  requirementsOrRules: string;
  roomDescription: string;
  ownerName: string;
  ownerContact: string;
  ownerEmail: string;
}

interface RoomImageBackend {
  imageId: number;
  imagePath: string;
}

const SingleRoomDetailsScreen: React.FC<SingleRoomDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { roomId } = route.params;
  const [details, setDetails] = useState<RoomDetailBackend | null>(null);
  const [images, setImages] = useState<RoomImageBackend[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSingleRoomData = async () => {
      try {
        setLoading(true);
        const userToken = await EncryptedStorage.getItem('userAccessToken');
        if (!userToken) {
          console.log('Access token missing');
          return;
        }

        const payload = { roomId };
        const response = await API.post('/room/getSingleRoomData', payload, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        setDetails(response?.data?.roomDetails);
        setImages(response?.data?.roomImages || []);
      } catch (err) {
        console.log('Error fetching single room details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleRoomData();
  }, [roomId]);

  const handleBack = () => {
    navigation.navigate('Home', { screen: 'RoomList' });
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = (emailId: string) => {
    Linking.openURL(`mailto:${emailId}`);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / deviceWidth);
    setActiveIndex(slideIndex);
  };

  if (loading) {
    return <Loader fullscreen message="Loading property details..." />;
  }

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Property details not found.</Text>
        <Pressable style={styles.errorBtn} onPress={handleBack}>
          <Text style={styles.errorBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const facilitiesArray = details.roomFacilities
    ? details.roomFacilities.split(',').map(f => f.trim())
    : [];

  return (
    <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
      {/* Horizontal Image Slider */}
      <View style={styles.sliderContainer}>
        {images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {images.map((item, index) => (
              <Image
                key={item.imageId || index}
                source={{ uri: item.imagePath }}
                style={styles.sliderImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.sliderImage, styles.placeholderImageContainer]}>
            <Text style={styles.placeholderImageText}>No Images Uploaded</Text>
          </View>
        )}

        {/* Carousel Dot Indicators */}
        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activeIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        )}

        {/* Back Floating Button */}
        <Pressable
          style={({ pressed }) => [
            styles.backArrowBtn,
            pressed && styles.pressedBackArrowBtn,
          ]}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Back to Room List"
        >
          <ArrowLeftIcon name="arrow-left" size={moderateScale(24)} color={COLORS.black} />
        </Pressable>

        {/* Overlay Title Section */}
        <View style={styles.sliderOverlay}>
          <Text style={styles.overlayLocality} numberOfLines={1}>
            {details.Locality}, {details.city}
          </Text>
          <Text style={styles.overlayTypeBadge}>{details.roomType}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Rent & Deposit Slabs */}
        <View style={styles.slabsRow}>
          {/* Slabs: Monthly Rent */}
          <View style={styles.slabWrapper}>
            <View style={styles.slabContent}>
              <View style={styles.slabLabels}>
                <Text style={styles.slabLabel}>Monthly Rent</Text>
                <Text style={styles.slabValue}>₹ {details.MonthlyRent} /-</Text>
              </View>
              <RupeeIcon name="rupee" size={moderateScale(20)} color={COLORS.white} style={styles.slabIcon} />
            </View>
          </View>

          {/* Slabs: Security Deposit */}
          <View style={styles.slabWrapper}>
            <View style={styles.slabContent}>
              <View style={styles.slabLabels}>
                <Text style={styles.slabLabel}>Security Deposit</Text>
                <Text style={styles.slabValue}>₹ {details.SecurityDeposit} /-</Text>
              </View>
              <ShieldIcon name="shield-check" size={moderateScale(20)} color={COLORS.white} style={styles.slabIcon} />
            </View>
          </View>
        </View>

        {/* Facilities Box */}
        <View style={styles.facilitiesBox}>
          <Text style={styles.sectionTitle}>Facilities Available</Text>
          <View style={styles.facilitiesGrid}>
            {[
              { name: 'Wifi', icon: (color: string) => <WifiIcon name="wifi" size={24} color={color} /> },
              { name: 'Parking', icon: (color: string) => <ParkingIcon name="car-side" size={22} color={color} /> },
              { name: 'TV', icon: (color: string) => <TvIcon name="tv" size={22} color={color} /> },
              { name: 'Furnished', icon: (color: string) => <FurnishedIcon name="bed-outline" size={24} color={color} /> },
            ].map(facility => {
              const active = facilitiesArray.includes(facility.name);
              return (
                <View key={facility.name} style={[styles.facilityItem, active && styles.facilityItemActive]}>
                  <View style={[styles.facilityIconCircle, active && styles.facilityIconCircleActive]}>
                    {facility.icon(active ? COLORS.black : COLORS.textMuted)}
                  </View>
                  <Text style={[styles.facilityLabel, active && styles.facilityLabelActive]}>
                    {facility.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tenant Preferences Card */}
        <View style={styles.detailCard}>
          <GenderIcon name="users" size={moderateScale(22)} color={COLORS.white} style={styles.detailCardIcon} />
          <View style={styles.detailCardText}>
            <Text style={styles.detailCardLabel}>Preferred Tenant</Text>
            <Text style={styles.detailCardValue}>{details.Preferred_tenants}</Text>
          </View>
        </View>

        {/* Location Details Card */}
        <View style={styles.detailCard}>
          <LocationIcon name="location-outline" size={moderateScale(22)} color={COLORS.white} style={styles.detailCardIcon} />
          <View style={styles.detailCardText}>
            <Text style={styles.detailCardLabel}>Room Location</Text>
            <Text style={styles.detailCardValue}>{details.FullAddress}</Text>
          </View>
        </View>

        {/* Rules & Requirements Card */}
        <View style={styles.detailCard}>
          <RulesIcon name="rule" size={moderateScale(22)} color={COLORS.white} style={styles.detailCardIcon} />
          <View style={styles.detailCardText}>
            <Text style={styles.detailCardLabel}>Rules / Requirements</Text>
            <Text style={styles.detailCardValue}>{details.requirementsOrRules || 'No specific rules listed.'}</Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.detailCard}>
          <DescriptionIcon name="file-text" size={moderateScale(22)} color={COLORS.white} style={styles.detailCardIcon} />
          <View style={styles.detailCardText}>
            <Text style={styles.detailCardLabel}>Property Description</Text>
            <Text style={styles.detailCardValue}>{details.roomDescription}</Text>
          </View>
        </View>

        {/* Owner Details Profile Slab */}
        <View style={styles.ownerCard}>
          <View style={styles.ownerCardHeader}>
            <OwnerIcon name="house-user" size={moderateScale(22)} color={COLORS.white} style={styles.detailCardIcon} />
            <Text style={styles.ownerCardTitle}>Owner Details</Text>
          </View>

          <View style={styles.ownerContent}>
            {/* Owner Name Row */}
            <View style={styles.ownerRow}>
              <UserIcon name="user" size={moderateScale(22)} color={COLORS.primary} style={styles.ownerRowIcon} />
              <View>
                <Text style={styles.ownerRowLabel}>Owner Name</Text>
                <Text style={styles.ownerRowValue}>{details.ownerName}</Text>
              </View>
            </View>

            <View style={styles.inlineDivider} />

            {/* Owner Phone Row */}
            <View style={styles.ownerRow}>
              <CallIcon name="call-outline" size={moderateScale(22)} color={COLORS.primary} style={styles.ownerRowIcon} />
              <View>
                <Text style={styles.ownerRowLabel}>Owner Contact No</Text>
                <Text style={styles.ownerRowValue}>{details.ownerContact}</Text>
              </View>
            </View>

            <View style={styles.inlineDivider} />

            {/* Owner Email Row */}
            <View style={styles.ownerRow}>
              <EmailIcon name="email" size={moderateScale(22)} color={COLORS.primary} style={styles.ownerRowIcon} />
              <View>
                <Text style={styles.ownerRowLabel}>Owner Email ID</Text>
                <Text style={styles.ownerRowValue}>{details.ownerEmail}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Primary Call/Email Action CTA Panel */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => handleCall(details.ownerContact)}
            accessibilityRole="button"
            accessibilityLabel="Call Owner"
          >
            <CallIcon name="call-outline" size={moderateScale(22)} color={COLORS.white} />
            <Text style={styles.actionBtnText}>Call</Text>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={() => handleEmail(details.ownerEmail)}
            accessibilityRole="button"
            accessibilityLabel="Email Owner"
          >
            <EmailIcon name="email" size={moderateScale(22)} color={COLORS.white} />
            <Text style={styles.actionBtnText}>Email</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default SingleRoomDetailsScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: COLORS.background,
  },
  errorText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(24),
    borderRadius: RADIUS.md,
  },
  errorBtnText: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  sliderContainer: {
    position: 'relative',
    height: moderateScale(300),
    backgroundColor: COLORS.greyLight,
  },
  sliderImage: {
    height: moderateScale(300),
    width: deviceWidth,
  },
  placeholderImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.greyLight,
  },
  placeholderImageText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: moderateScale(15),
    width: '100%',
    gap: moderateScale(6),
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: RADIUS.round,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: moderateScale(10),
    height: moderateScale(10),
  },
  backArrowBtn: {
    position: 'absolute',
    top: moderateScale(45),
    left: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: moderateScale(8),
    borderRadius: RADIUS.md,
    ...shadows.sm,
  },
  pressedBackArrowBtn: {
    opacity: 0.8,
  },
  sliderOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayLocality: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
    flex: 1,
    marginRight: spacing.sm,
  },
  overlayTypeBadge: {
    ...TYPOGRAPHY.caption,
    color: COLORS.black,
    backgroundColor: COLORS.primary,
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(10),
    borderRadius: RADIUS.sm,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  slabsRow: {
    flexDirection: 'column',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  slabWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    ...shadows.md,
    overflow: 'hidden',
  },
  slabContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fffdf1',
    marginLeft: moderateScale(8),
    padding: spacing.md,
    borderTopRightRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  slabLabels: {
    gap: moderateScale(2),
  },
  slabLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  slabValue: {
    ...TYPOGRAPHY.h2,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: COLORS.black,
  },
  slabIcon: {
    backgroundColor: COLORS.primary,
    padding: moderateScale(10),
    borderRadius: RADIUS.md,
    width: moderateScale(42),
    height: moderateScale(42),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  facilitiesBox: {
    backgroundColor: COLORS.white,
    marginHorizontal: spacing.lg,
    borderRadius: RADIUS.lg,
    padding: spacing.md,
    ...shadows.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  facilityItem: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(6),
    alignItems: 'center',
    width: '23%',
    gap: spacing.sm,
    opacity: 0.6,
  },
  facilityItemActive: {
    backgroundColor: '#fcf3c3',
    opacity: 1,
  },
  facilityIconCircle: {
    backgroundColor: COLORS.white,
    padding: moderateScale(8),
    borderRadius: RADIUS.md,
  },
  facilityIconCircleActive: {
    backgroundColor: COLORS.primary,
  },
  facilityLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  facilityLabelActive: {
    color: COLORS.black,
  },
  detailCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    marginHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
    overflow: 'hidden',
  },
  detailCardIcon: {
    backgroundColor: COLORS.primary,
    padding: moderateScale(12),
    borderRadius: RADIUS.md,
    marginLeft: spacing.md,
    width: moderateScale(45),
    height: moderateScale(45),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  detailCardText: {
    flex: 1,
    backgroundColor: '#fffdf1',
    marginLeft: moderateScale(8),
    padding: spacing.md,
    borderTopRightRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    gap: moderateScale(2),
  },
  detailCardLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  detailCardValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    lineHeight: moderateScale(20),
  },
  ownerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    marginHorizontal: spacing.lg,
    ...shadows.md,
    overflow: 'hidden',
  },
  ownerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ownerCardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
    marginLeft: spacing.xs,
  },
  ownerContent: {
    backgroundColor: '#fffdf1',
    marginLeft: moderateScale(8),
    padding: spacing.md,
    borderTopRightRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    gap: spacing.sm,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ownerRowIcon: {
    marginLeft: spacing.sm,
  },
  ownerRowLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  ownerRowValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  inlineDivider: {
    height: 1.5,
    backgroundColor: COLORS.border,
    width: '90%',
    alignSelf: 'center',
    marginVertical: moderateScale(4),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingBottom: moderateScale(80),
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: moderateScale(14),
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  actionBtnText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.white,
  },
});
