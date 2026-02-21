import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { base, list } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type LoreItem = {
  id?: string | number;
  title?: string;
  content?: string;
};

export default function HomeScreen() {
  const [loreData, setLoreData] = useState<LoreItem[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const loadLoreData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/lore');
      if (!response.ok) {
        setLoreData([]);
        throw new Error(`Failed to fetch Lore: ${response.statusText}`);
      };

      const data = await response.json();
      setLoreData(Array.isArray(data?.docs) ? data.docs : []);
      console.log('Lore data loaded successfully:', data.docs);
      return;
    } catch (error) {
      console.error('Error fetching Lore:', error);
    }
  }

  useEffect(() => {
    loadLoreData();
  }, []);

  return (
    <View style={base.container}>
      <FlatList
        data={loreData}
        contentContainerStyle={[
          list.contentContainer,
          loreData.length === 0 && list.contentContainerEmpty,
        ]}
        ItemSeparatorComponent={() => <View style={list.separatorBase} />}
        ListEmptyComponent={
          <Text
            style={[
              list.emptyMessageBase,
              isDark ? list.emptyMessageDark : list.emptyMessageLight,
            ]}
          >
            No lore entries yet.
          </Text>
        }
        keyExtractor={(item, index) =>
          item.id ? String(item.id) : `${item.title ?? 'lore'}-${index}`
        }
        renderItem={({ item }) => {
          return (
            <View style={[list.itemBase, isDark ? list.itemDark : list.itemLight]}>
              <Text style={[list.itemTitle, isDark ? list.itemTitleDark : list.itemTitleLight]}>
                {item.title ?? 'Untitled'}
              </Text>
              <Text style={[list.itemMeta, isDark ? list.itemMetaDark : list.itemMetaLight]}>
                {item.content ?? 'No content'}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
