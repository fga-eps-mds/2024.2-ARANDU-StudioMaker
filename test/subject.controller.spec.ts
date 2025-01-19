import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSubjectDTO } from '../src/subject/dtos/createSubject.dto';
import { SubjectController } from '../src/subject/subject.controller';
import { SubjectService } from '../src/subject/subject.service';

describe('SubjectController', () => {
  let controller: SubjectController;

  const mockSubjectService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addJourneyToSubject: jest.fn(),
    getJourneysBySubjectId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectController],
      providers: [
        {
          provide: SubjectService,
          useValue: mockSubjectService,
        },
      ],
    }).compile();

    controller = module.get<SubjectController>(SubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a subject', async () => {
      const createSubjectDTO: CreateSubjectDTO = {
        name: 'asdas',
        shortName: 'as',
        description: 'asdasd',
      };
      const subject = {
        _id: 'subject-id',
        ...createSubjectDTO,
      };

      const token = 'valid-token';
      mockSubjectService.create.mockResolvedValue(subject);

      const result = await controller.create(createSubjectDTO, {
        headers: { authorization: `Bearer ${token}` },
      } as any);
      expect(result).toEqual(subject);
      expect(mockSubjectService.create).toHaveBeenCalledWith(
        createSubjectDTO,
        token,
      );
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      const createSubjectDTO: CreateSubjectDTO = {
        name: 'aasd',
        shortName: 'as',
        description: 'asda',
      };

      await expect(
        controller.create(createSubjectDTO, { headers: {} } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return all subjects', async () => {
      const subjects = [{ _id: 'subject-id-1' }, { _id: 'subject-id-2' }];

      mockSubjectService.findAll.mockResolvedValue(subjects);

      const result = await controller.findAll();
      expect(result).toEqual(subjects);
      expect(mockSubjectService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByUser', () => {
    it('should return subjects by user id', async () => {
      const subjects = [{ _id: 'subject-id' }];

      mockSubjectService.findByUserId.mockResolvedValue(subjects);

      const result = await controller.findByUser('user-id');
      expect(result).toEqual(subjects);
      expect(mockSubjectService.findByUserId).toHaveBeenCalledWith('user-id');
    });
  });

  describe('findById', () => {
    it('should return a subject by id', async () => {
      const subject = { _id: 'subject-id' };

      mockSubjectService.findById.mockResolvedValue(subject);

      const result = await controller.findById('subject-id');
      expect(result).toEqual(subject);
      expect(mockSubjectService.findById).toHaveBeenCalledWith('subject-id');
    });

    it('should throw NotFoundException if subject is not found', async () => {
      mockSubjectService.findById.mockRejectedValue(new NotFoundException());

      await expect(controller.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a subject and return the updated subject', async () => {
      const updateSubjectDto: CreateSubjectDTO = {
        name: '',
        shortName: '',
        description: '',
      };
      const updatedSubject = { _id: 'subject-id', ...updateSubjectDto };

      mockSubjectService.update.mockResolvedValue(updatedSubject);

      const result = await controller.update('subject-id', updateSubjectDto);
      expect(result).toEqual(updatedSubject);
      expect(mockSubjectService.update).toHaveBeenCalledWith(
        'subject-id',
        updateSubjectDto,
      );
    });

    it('should throw NotFoundException if Subject is not found', async () => {
      mockSubjectService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('invalid-id', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a subject', async () => {
      mockSubjectService.delete.mockResolvedValue(undefined);

      await expect(controller.delete('subject-id')).resolves.not.toThrow();
      expect(mockSubjectService.delete).toHaveBeenCalledWith('subject-id');
    });

    it('should throw NotFoundException if subject is not found', async () => {
      mockSubjectService.delete.mockRejectedValue(new NotFoundException());

      await expect(controller.delete('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addJourneyToSubject', () => {
    it('should add a journey to a subject', async () => {
      const journeyId = 'journey-id';
      const updatedSubject = { _id: 'subject-id', journeyIds: [journeyId] };

      mockSubjectService.addJourneyToSubject.mockResolvedValue(updatedSubject);

      const result = await controller.addJourneyToSubject('subject-id', journeyId);
      expect(result).toEqual(updatedSubject);
      expect(mockSubjectService.addJourneyToSubject).toHaveBeenCalledWith(
        'subject-id',
        journeyId,
      );
    });
  });

  describe('getJourneysBySubjectId', () => {
    it('should return journeys by subject id', async () => {
      const journeys = [
        { _id: 'journey-id-1' /* outros campos */ },
        { _id: 'journey-id-2' /* outros campos */ },
      ];

      mockSubjectService.getJourneysBySubjectId.mockResolvedValue(journeys);

      const result = await controller.getJourneysBySubjectId('subject-id');
      expect(result).toEqual(journeys);
      expect(mockSubjectService.getJourneysBySubjectId).toHaveBeenCalledWith(
        'subject-id',
      );
    });

    it('should throw NotFoundException if subject is not found', async () => {
      mockSubjectService.getJourneysBySubjectId.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        controller.getJourneysBySubjectId('invalid-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
