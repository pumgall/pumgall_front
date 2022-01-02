<template>
  <v-container>
    <v-row>
      <v-autocomplete
        v-model="filterData.title"
        :items="filterList.title"
        label="Song"
        multiple
        clearable
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0" small>
            <span>{{ item }}</span>
          </v-chip>
          <span
            v-if="index === 1"
            class="grey--text caption"
          >(+{{ filterData.title.length - 1 }} others)</span>
        </template>
      </v-autocomplete>

      <v-autocomplete
        v-model="filterData.maker"
        :items="filterList.maker"
        label="UCS Maker"
        multiple
        clearable
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0" small>
            <span>{{ item }}</span>
          </v-chip>
          <span
            v-if="index === 1"
            class="grey--text caption"
          >(+{{ filterData.maker.length - 1 }} others)</span>
        </template>
      </v-autocomplete>

      <v-autocomplete
        v-model="filterData.mode"
        :items="filterList.mode"
        label="Mode"
        multiple
        clearable
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0" small>
            <span>{{ item }}</span>
          </v-chip>
          <span
            v-if="index === 1"
            class="grey--text caption"
          >(+{{ filterData.mode.length - 1 }} others)</span>
        </template>
      </v-autocomplete>

      <v-autocomplete
        v-model="filterData.level"
        :items="filterList.level"
        label="Level"
        multiple
        clearable
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0" small>
            <span>{{ item }}</span>
          </v-chip>
          <span
            v-if="index === 1"
            class="grey--text caption"
          >(+{{ filterData.level.length - 1 }} others)</span>
        </template>
      </v-autocomplete>
    </v-row>
    <!-- <v-row> -->
    <v-data-table
      :headers="field"
      :items="songs"
      :search="search"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items-per-page="30"
      show-expand
      width="100%"
    >
      <template v-slot:[`item.id`]="{ item }">
        <v-img :src="`/assets/ucsSongs/${item.songId}.jpg`" max-width="60vw" width="150" />
      </template>

      <template v-slot:[`item.level`]="{ item }">
        <v-img :src="getLevelIcon(item)" max-width="35"></v-img>
      </template>

      <template v-slot:[`item.download`]="{ item }">
        <v-btn color="primary" :href="`/assets/ucsFiles/${item.id}.ucs`" download>
          <v-icon left>mdi-download</v-icon>DOWNLOAD
        </v-btn>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding: 0px">
          <span>{{ item.description }}</span>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

interface SongInfo {
  id: string;
  title: string;
  artist: string;
}

interface UcsData {
  id: number;
  time: string;
  maker: string;
  makerCountry: string;
  songId: string;
  mode: string;
  level: number;
  description: string;
}

interface CombindData {
  id: number;
  time: string;
  maker: string;
  songId: string;
  title: string;
  mode: string;
  level: number;
  description: string;
}

export default Vue.extend({
  data() {
    const field = [
      { text: "Ucs Id", value: "id", filterable: false },
      { text: "Title", value: "title" },
      { text: "Maker", value: "maker" },
      { text: "Level", value: "level" },
      { text: "UploadAt", value: "time", filterable: false },
      { text: "Download", value: "download", filterable: false },
    ];

    const mode = [
      "single", "double", "sinper", "douper",
      "coop1", "coop2", "coop3", "coop4", "coop5"
    ];

    const level = Array.from(Array(30), (_, i) => i + 1);

    const filterData: { [k: string]: string[] } = {
      title: [],
      maker: [],
      mode: [],
      level: [],
    };

    const filterList = {
      title: [] as string[],
      maker: [] as string[],
      mode,
      level,
    };

    return {
      showAdvSearch: false,
      search: "",
      filterData,

      sortBy: "id",
      sortDesc: true,

      tab: {},

      field,
      filterList,

      origUcss: [] as CombindData[],
    };
  },
  computed: {
    songs(): CombindData[] {
      let list = this.origUcss;

      for (const [p, l] of Object.entries(this.filterData)) {
        if (!l.length) continue;

        switch (p) {
          // case "level":
          //   {
          //     const list2: CombindData[] = [];
          //     const ll: number[] = (l as unknown[]) as number[];

          //     for (const song of list) {
          //       const filteredSteps = song.steps.filter(
          //         (v) => -1 < ll.indexOf(v.level)
          //       );
          //       if (!filteredSteps.length) continue;

          //       list2.push({ ...song, steps: filteredSteps });
          //     }

          //     list = list2;
          //   }
          //   break;

          // case "mode":
          //   {
          //     const list2: CombindData[] = [];

          //     for (const song of list) {
          //       const filteredSteps = song.steps.filter(
          //         (v) => -1 < l.indexOf(v.mode)
          //       );
          //       if (!filteredSteps.length) continue;

          //       list2.push({ ...song, steps: filteredSteps });
          //     }

          //     list = list2;
          //   }
          //   break;

          default:
            list = list.filter((v) => -1 < l.indexOf((v as any)[p]));
        }
      }

      return list;
    },
  },
  async mounted() {
    const DATA = await (await fetch('/assets/ucs.json')).json() as UcsData[];
    const SONGINFO = await (await fetch('/assets/ucsSong.json')).json() as SongInfo[];

    const songMap = {} as Record<string, SongInfo>;
    const makerSet = new Set<string>();

    for (const v of SONGINFO) {
      songMap[v.id] = v;

      const title = `${v.artist} - ${v.title}`;
      this.filterList.title.push(title);
    }

    for (const v of DATA) {
      const song = songMap[v.songId];
      const maker = `${v.maker} (${v.makerCountry})`;
      this.origUcss.push({
        id: v.id,
        time: new Date(v.time).toLocaleString(),
        maker: `${v.maker} (${v.makerCountry})`,
        songId: song.id,
        title: `${song.artist} - ${song.title}`,
        mode: v.mode,
        level: v.level,
        description: v.description,
      });

      makerSet.add(maker);
    }

    this.filterList.maker = [...makerSet];

    this.filterList.title.sort();
    this.filterList.maker.sort();
  },
  methods: {
    getLevelIcon(data: CombindData) {
      const path = "/assets/level_icons/";
      if (data.mode.startsWith("coop")) return `${path}${data.mode}.png`;

      return `${path}${data.mode}_${data.level}.png`;
    },
  },
});
</script>

<style scoped>
th > span {
  white-space: nowrap;
}
</style>
