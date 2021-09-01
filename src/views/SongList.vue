<template>
  <v-container>
    <!-- <v-layout row wrap>
      <v-flex xs12> -->
    <v-row v-if="showAdvSearch">
      <v-autocomplete
        v-model="filterData.series"
        :items="filterList.series"
        label="Series"
        multiple
        clearable
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0" small>
            <span>{{ item.text }}</span>
          </v-chip>
          <span v-if="index === 1" class="grey--text caption">
            (+{{ filterData.series.length - 1 }} others)
          </span>
        </template>
      </v-autocomplete>

      <v-autocomplete
        v-model="filterData.channel"
        :items="filterList.channel"
        label="Channel"
        multiple
        clearable
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0" small>
            <span>{{ item }}</span>
          </v-chip>
          <span v-if="index === 1" class="grey--text caption">
            (+{{ filterData.channel.length - 1 }} others)
          </span>
        </template>
      </v-autocomplete>

      <v-autocomplete
        v-model="filterData.bpm"
        :items="filterList.bpm"
        label="BPM"
        multiple
        clearable
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0" small>
            <span>{{ item.text }}</span>
          </v-chip>
          <span v-if="index === 1" class="grey--text caption">
            (+{{ filterData.bpm.length - 1 }} others)
          </span>
        </template>
      </v-autocomplete>

      <v-autocomplete
        v-model="filterData.stepMakers"
        :items="filterList.stepMakers"
        label="Step Maker"
        multiple
        clearable
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0" small>
            <span>{{ item }}</span>
          </v-chip>
          <span v-if="index === 1" class="grey--text caption">
            (+{{ filterData.stepMakers.length - 1 }} others)
          </span>
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
          <span v-if="index === 1" class="grey--text caption">
            (+{{ filterData.mode.length - 1 }} others)
          </span>
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
          <span v-if="index === 1" class="grey--text caption">
            (+{{ filterData.level.length - 1 }} others)
          </span>
        </template>
      </v-autocomplete>
    </v-row>
    <v-row>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search (Title or Artist)"
        single-line
        hide-details
        dense
      ></v-text-field>
      <v-btn icon @click="showAdvSearch = !showAdvSearch" color="indigo"
        ><v-icon>{{ showAdvSearch ? "mdi-minus" : "mdi-plus" }}</v-icon></v-btn
      >
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
        <v-img
          :src="`/assets/songs/${item.id}.png`"
          max-width="60vw"
          width="150"
        />
      </template>
      <template v-slot:[`item.series`]="{ item }">
        <span>{{ getSeriesDesc(item.series) }}</span>
      </template>
      <template v-slot:[`item.bpm_min`]="{ item }">
        <span
          >{{ item.bpm_min
          }}{{ item.bpm_max ? ` ~ ${item.bpm_max}` : "" }}</span
        >
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding: 0px">
          <div>
            <v-tabs v-model="tab[item.id]">
              <v-tab
                v-for="step in item.steps"
                :key="`${step.mode}_${step.level}`"
              >
                <v-img :src="getLevelIcon(step)" max-width="35"></v-img>
              </v-tab>
            </v-tabs>
            <div v-if="item.steps[tab[item.id]]" style="padding: 10px">
              <p>Step Maker : {{ item.steps[tab[item.id]].maker }}</p>
              <iframe
                v-if="item.steps[tab[item.id]].youtube"
                width="640"
                height="360"
                :src="`https://www.youtube.com/embed/${
                  item.steps[tab[item.id]].youtube
                }`"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="max-width: 80vw"
              ></iframe>
            </div>
          </div>
        </td>
      </template>
    </v-data-table>
    <p class="justify-center text-center"
      ><a
        href="https://gist.github.com/SerenityS/80e1c69f76961950c21fad949bed454b"
        target="_blank"
        >Data Source</a
      ></p
    >
    <!-- </v-row> -->
    <!-- </v-flex>
    </v-layout> -->
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import DATA from "../assets/combinedData.json";

interface StepInfo {
  mode: string;
  level: number;
  maker: string;
  youtube?: string;
}

interface SongData {
  id: number;
  title: string;
  artist: string;
  series: string;
  channel: string;
  bpm_min: number;
  bpm_max: number;
  steps: StepInfo[];
}

interface CombinedData {
  songs: SongData[];
  stepMakers: string[];
}

export default Vue.extend({
  data() {
    const field = [
      { text: "Song Id", value: "id", filterable: false },
      { text: "Title", value: "title" },
      { text: "Artist", value: "artist" },
      { text: "Series", value: "series", filterable: false },
      { text: "Channel", value: "channel", filterable: false },
      { text: "BPM", value: "bpm_min", filterable: false },
    ];

    const series = [
      { text: "1st To Perfect Collection", value: "1st_per" },
      { text: "Extra To The Prex 3", value: "extra_prex3" },
      { text: "Exceed To Zero", value: "exceed_zero" },
      { text: "NX To NX Absolute", value: "nx_nxa" },
      { text: "Fiesta to Fiesta 2", value: "fiesta" },
      { text: "Prime", value: "prime1" },
      { text: "Prime 2", value: "prime2" },
      { text: "XX", value: "piuxx" },
    ];

    const bpm = [
      { text: "Under 100", value: { min: -1, max: 100 } },
      { text: "101 ~ 120", value: { min: 100, max: 120 } },
      { text: "121 ~ 140", value: { min: 120, max: 140 } },
      { text: "141 ~ 160", value: { min: 140, max: 140 } },
      { text: "161 ~ 180", value: { min: 160, max: 180 } },
      { text: "181 ~ 200", value: { min: 180, max: 200 } },
      { text: "201 ~ 220", value: { min: 200, max: 220 } },
      { text: "Over 220", value: { min: 220, max: 9999 } },
    ];

    const channel = ["K-POP", "ORIGINAL", "WORLD MUSIC", "J-MUSIC", "XROSS"];

    const mode = ["single", "double", "sinper", "douper", "coop"];

    const level = Array.from(Array(30), (_, i) => i + 1);

    const filterData: { [k: string]: string[] } = {
      series: [],
      bpm: [],
      channel: [],
      stepMakers: [],
      mode: [],
      level: [],
    };

    const filterList = {
      series,
      bpm,
      channel,
      stepMakers: [] as string[],
      mode,
      level,
    };

    const origSongs: SongData[] = [];

    return {
      showAdvSearch: false,
      search: "",
      filterData,

      sortBy: "id",
      sortDesc: true,

      tab: {},

      field,
      origSongs,
      filterList,
    };
  },
  computed: {
    songs(): SongData[] {
      let list = this.origSongs;

      for (const [p, l] of Object.entries(this.filterData)) {
        if (!l.length) continue;

        switch (p) {
          case "bpm":
            {
              const ll = (l as unknown) as { min: number; max: number }[];
              list = list.filter((v) => {
                const bpm = v.bpm_max ? v.bpm_max : v.bpm_min;
                for (const f of ll)
                  if (f.min < bpm && bpm <= f.max) return true;

                return false;
              });
            }
            break;

          case "stepMakers":
            {
              const list2: SongData[] = [];

              for (const song of list) {
                const filteredSteps = song.steps.filter(
                  (v) => -1 < l.indexOf(v.maker)
                );
                if (!filteredSteps.length) continue;

                list2.push({ ...song, steps: filteredSteps });
              }

              list = list2;
            }
            break;

          case "level":
            {
              const list2: SongData[] = [];
              const ll: number[] = (l as unknown[]) as number[];

              for (const song of list) {
                const filteredSteps = song.steps.filter(
                  (v) => -1 < ll.indexOf(v.level)
                );
                if (!filteredSteps.length) continue;

                list2.push({ ...song, steps: filteredSteps });
              }

              list = list2;
            }
            break;

          case "mode":
            {
              const list2: SongData[] = [];

              for (const song of list) {
                const filteredSteps = song.steps.filter(
                  (v) => -1 < l.indexOf(v.mode)
                );
                if (!filteredSteps.length) continue;

                list2.push({ ...song, steps: filteredSteps });
              }

              list = list2;
            }
            break;

          default:
            list = list.filter((v) => -1 < l.indexOf((v as any)[p]));
        }
      }

      return list;
    },
  },
  mounted() {
    this.origSongs = DATA.songs;
    this.filterList.stepMakers = DATA.stepMakers;
  },
  methods: {
    getSeriesDesc(series: string) {
      const r = this.filterList.series.find((v) => v.value == series);
      if (!r) return series;

      return r.text;
    },
    getLevelIcon(step: StepInfo) {
      const path = "/assets/level_icons/";
      if ("coop" == step.mode) return `${path}coop${step.level}.png`;

      return `${path}${step.mode}_${step.level}.png`;
    },
  },
});
</script>

<style scoped>
th > span {
  white-space: nowrap;
}
</style>
