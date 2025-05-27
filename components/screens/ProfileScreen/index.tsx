import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { AccountWidget } from '@/types/account.types';
import { BottomSheet, Button, ButtonGroup, Icon, ListItem } from '@rn-vui/themed';
import { IconArrowLoopRight, IconArrowNarrowLeft, IconArrowsShuffle, IconBellRinging, IconBusStop, IconCirclePlusFilled, IconUser } from '@tabler/icons-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { styles } from './styles';
// import BottomSheetWrapper from '@/components/common/BottomSheet';

// import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Link, router, useNavigation } from 'expo-router';
// import AddFavoriteStop from '@/app/(modal)/AddFavoriteStopModal';
// import AddFavoriteLine from '@/app/(modal)/AddFavoriteLineModal';
// import ProfileEditModal from '@/app/(modal)/ProfileEditModal';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import FavoriteItem from '@/components/common/FavoriteItem';
// import { NativeViewGestureHandler } from 'react-native-gesture-handler';


export default function ProfileScreen() {
  //

  //
  // A. Setup variables

  const navigation = useNavigation();
  const themeContext = useThemeContext();
  const profileStyles = styles();
  const profileContext = useProfileContext();
  const { persona_image, profile } = profileContext.data;
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const initialWidgets = (profile?.widgets ?? []).flatMap((widget) => {
    if (widget.data.type === 'lines') return [widget];
    if (widget.data.type === 'stops' && Array.isArray(widget.data.pattern_ids)) {
      return widget.data.pattern_ids.map(patternId => ({
        ...widget,
        data: { ...widget.data, pattern_ids: [patternId] },
      }));
    }
    return [];
  });
  const [widgetList, setWidgetList] = useState(() => initialWidgets);

  //
  // B. Transform data

  function widgetKey(widget: AccountWidget) {
    if (widget.data.type === 'lines') {
      return `lines-${widget.data.pattern_id}`;
    }
    if (widget.data.type === 'stops') {
      return `stops-${widget.data.stop_id}-${widget.data.pattern_ids.join(',')}`;
    }
    return JSON.stringify(widget);
  }

  useEffect(() => {
    const currentKeys = widgetList.map(widgetKey);
    const newKeys = initialWidgets.map(widgetKey);
    if (currentKeys.length !== newKeys.length || currentKeys.some((k, i) => k !== newKeys[i])) {
      setWidgetList(initialWidgets);
    }
  }, [profile?.widgets]);

  //
  // C. Handle actions

  const handleRefreshPersona = () => profileContext.actions.fetchPersona();
  const goBackInHistory = () => profileContext.actions.setPreviousPersona();

  //
  // D. Render components

  const renderFavoriteItem = ({ drag, isActive, item }: any) => (
    <Pressable disabled={isActive} onLongPress={drag}>
      <FavoriteItem data={item} />
    </Pressable>
  );

  const buttons = [
    {
      element: () => (
        <Pressable onPress={persona_image ? goBackInHistory : undefined} disabled={!persona_image}>
          <IconArrowNarrowLeft color={theming.colorSystemText300} size={24} />
        </Pressable>
      )
    },
    {
      element: () => (
        <Pressable onPress={handleRefreshPersona}>
          <IconArrowsShuffle color={theming.colorSystemText300} size={24} />
        </Pressable>
      )
    },
  ];

  useEffect(() => {
    navigation.setOptions({ headerStyle: { backgroundColor: themeContext.theme.lightColors?.background } });
  }, [navigation, themeContext.theme.mode]);

  const ListHeader = () => (
    <>
      <View style={profileStyles.userSection}>
        {persona_image ? <ProfileImage size={200} borderWidth={10} color={profileContext.data.accent_color || ''} type="url" backgroundColor={profileContext.data.accent_color ? dimAvatarBackground(profileContext.data.accent_color) : 'rgba(253,183,26,0.4))'} />
          : <ProfileImage width={200} height={200} type="local" />}
        <ButtonGroup buttons={buttons} containerStyle={{ backgroundColor: themeContext.theme.lightColors?.background, borderRadius: 30, marginTop: -20, width: '25%' }} />
        <Text style={profileStyles.userFullNameText}> {profileContext.data.profile?.profile?.first_name}{' '}{profileContext.data.profile?.profile?.last_name}
        </Text>
      </View>
      <Section heading="Editar e ordenar favoritos" />
      {!widgetList.length && <NoDataLabel text="Sem favoritos" fill />}
    </>
  );

  const ListFooter = () => (
    <View style={profileStyles.addFavoritesSection}>
      <Section heading="Adicionar favoritos" />
      <Link href="/addFavoriteStop" asChild>
        <ListItem>
          <IconBusStop color="#FF6900" size={24} />
          <ListItem.Content>
            <ListItem.Title style={profileStyles.listTitle}><Text>Paragem Favorita</Text></ListItem.Title>
          </ListItem.Content>
          <IconCirclePlusFilled size={24} fill="#3CB43C" color="#FFFFFF" />
        </ListItem>
      </Link> <Link href="/addFavoriteLine" asChild>
        <ListItem>
          <IconArrowLoopRight color="#C61D23" size={24} />
          <ListItem.Content>
            <ListItem.Title style={profileStyles.listTitle}><Text>Linha Favorita</Text></ListItem.Title>
          </ListItem.Content>
          <IconCirclePlusFilled size={24} fill="#3CB43C" color="#FFFFFF" />
        </ListItem>
      </Link>
      <Link href="/profileEdit" style={{ width: '100%' }} asChild>
        <ListItem>
          <IconUser color="#0C807E" size={24} />
          <ListItem.Content>
            <ListItem.Title style={profileStyles.listTitle}><Text>Editar Perfil</Text></ListItem.Title>
          </ListItem.Content>
          <IconCirclePlusFilled size={24} fill="#3CB43C" color="#FFFFFF" />
        </ListItem>
      </Link>
      <ListItem disabledStyle={{ opacity: 0.6 }} disabled>
        <IconBellRinging color="#0C807E" size={24} />
        <ListItem.Content>
          <ListItem.Title style={profileStyles.listTitle}>
            <Text>Notificações Inteligentes</Text>
          </ListItem.Title>
          <ListItem.Subtitle><Text>Disponível em breve</Text></ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </View>
  );

  return (
    <View>
      <DraggableFlatList
        data={widgetList}
        ListFooterComponent={ListFooter}
        ListHeaderComponent={ListHeader}
        nestedScrollEnabled={false}
        renderItem={renderFavoriteItem}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.data.type === 'lines' ? `line-${item.data.pattern_id}` : item.data.type === 'stops' ? `stop-${item.data.stop_id}-${item.data.pattern_ids[0]}` : JSON.stringify(item)
        }
        onDragEnd={({ data }) => {
          setWidgetList(data);
          if (saveTimer.current) clearTimeout(saveTimer.current);
          saveTimer.current = setTimeout(() => {
            if (!profile) return;
            const orderedWidgets = data.map((widget, idx) => ({
              ...widget,
              settings: { ...widget.settings, display_order: idx },
            }));
            profileContext.actions.updateLocalProfile({ ...profile, widgets: orderedWidgets });
          }, 1000);
        }}
      />
    </View>
  );

  //

}