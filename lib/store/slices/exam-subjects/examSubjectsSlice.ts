import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createExamSubjectTemplate,
  deleteExamSubjectTemplate,
  getAdminExamGroups,
  getExamSubjectTemplates,
  updateExamSubjectTemplate,
} from '@/lib/api';
import type { ExamSubjectTemplate, SubjectQuadrant } from '@/lib/types/exam-subjects';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchExamSubjects = createAsyncThunk(
  'examSubjects/fetch',
  async (examGroup: string, { rejectWithValue }) => {
    const [groupsRes, templatesRes] = await Promise.all([
      getAdminExamGroups(),
      getExamSubjectTemplates(examGroup || undefined),
    ]);
    if (!groupsRes.ok) return rejectWithValue(groupsRes.error);
    if (!templatesRes.ok) return rejectWithValue(templatesRes.error);
    return {
      groups: groupsRes.data.groups,
      templates: templatesRes.data.templates,
      examGroup,
    };
  },
);

export const saveExamSubjectTemplate = createAsyncThunk(
  'examSubjects/save',
  async (
    payload: {
      id?: string;
      examGroup: string;
      name: string;
      quadrant: SubjectQuadrant;
      sortOrder: number;
    },
    { dispatch, rejectWithValue },
  ) => {
    const { id, examGroup, name, quadrant, sortOrder } = payload;
    const res = id
      ? await updateExamSubjectTemplate(id, { examGroup, name, quadrant, sortOrder })
      : await createExamSubjectTemplate({ examGroup, name, quadrant, sortOrder });
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchExamSubjects(examGroup));
    return id ? 'Subject updated' : 'Subject added';
  },
);

export const removeExamSubjectTemplate = createAsyncThunk(
  'examSubjects/delete',
  async (
    { id, examGroup }: { id: string; examGroup: string },
    { dispatch, rejectWithValue },
  ) => {
    const res = await deleteExamSubjectTemplate(id);
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchExamSubjects(examGroup));
    return 'Subject removed';
  },
);

type ExamSubjectsState = AsyncSliceState & {
  groups: string[];
  templates: ExamSubjectTemplate[];
  selectedExamGroup: string;
  saving: boolean;
  deletingId: string | null;
};

const initialState: ExamSubjectsState = {
  ...asyncInitial,
  groups: [],
  templates: [],
  selectedExamGroup: 'NEET',
  saving: false,
  deletingId: null,
};

const examSubjectsSlice = createSlice({
  name: 'examSubjects',
  initialState,
  reducers: {
    setSelectedExamGroup(state, action: { payload: string }) {
      state.selectedExamGroup = action.payload;
    },
    clearExamSubjectsMessage(state) {
      state.message = '';
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamSubjects.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchExamSubjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.groups = action.payload.groups;
        state.templates = action.payload.templates;
        if (action.payload.examGroup) {
          state.selectedExamGroup = action.payload.examGroup;
        } else if (!state.selectedExamGroup && action.payload.groups.length > 0) {
          state.selectedExamGroup = action.payload.groups[0];
        }
      })
      .addCase(fetchExamSubjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load templates';
      })
      .addCase(saveExamSubjectTemplate.pending, (state) => {
        state.saving = true;
        state.error = '';
      })
      .addCase(saveExamSubjectTemplate.fulfilled, (state, action) => {
        state.saving = false;
        state.message = action.payload;
      })
      .addCase(saveExamSubjectTemplate.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) ?? 'Save failed';
      })
      .addCase(removeExamSubjectTemplate.pending, (state, action) => {
        state.deletingId = action.meta.arg.id;
      })
      .addCase(removeExamSubjectTemplate.fulfilled, (state, action) => {
        state.deletingId = null;
        state.message = action.payload;
      })
      .addCase(removeExamSubjectTemplate.rejected, (state, action) => {
        state.deletingId = null;
        state.error = (action.payload as string) ?? 'Delete failed';
      });
  },
});

export const { setSelectedExamGroup, clearExamSubjectsMessage } = examSubjectsSlice.actions;
export default examSubjectsSlice.reducer;

export const selectExamSubjects = (state: { examSubjects: ExamSubjectsState }) =>
  state.examSubjects;
