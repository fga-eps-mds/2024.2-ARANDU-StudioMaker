import { HttpService } from '@nestjs/axios';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { of } from 'rxjs';
import { UpdateSubjectOrderInterface } from '../src/subject/dtos/updateSubjectOrder.dto';
import { SubjectService } from '../src/subject/subject.service';

describe('SubjectService', () => {
  let service: SubjectService;
  let mockSubjectModel: any;
  let mockHttpService: any;

  beforeEach(async () => {
    mockSubjectModel = {
      create: jest.fn().mockImplementation((dto) => dto),
      findById: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
      bulkWrite: jest.fn(),
    };

    mockHttpService = {
      get: jest.fn(),
      patch: jest.fn(),
      put: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        {
          provide: getModelToken('Subject'),
          useValue: mockSubjectModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SubjectService>(SubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      jest.spyOn(service, 'validateTokenAndGetUserId').mockResolvedValue(null);

      await expect(
        service.create(
          { name: 'Test Subject', shortName: "Tst Sub", description: 'Description' },
          'invalid-token',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('create', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      const createSubjectDTO = {
        name: 'Test Subject',
        shortName: "Tst Pt",
        description: 'Description',
      };
      const token = 'invalid-token';

      jest.spyOn(service, 'validateTokenAndGetUserId').mockResolvedValue(null);

      await expect(service.create(createSubjectDTO, token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('addSubjectToUser', () => {
    it('should call the user service to add the subject', async () => {
      const userId = 'user-id';
      const subjectId = 'subject-id';
  
      jest.spyOn(mockHttpService, 'put').mockReturnValue(of({}));
  
      await service.addSubjectToUser(userId, subjectId);
  
      expect(mockHttpService.put).toHaveBeenCalledWith(
        `${process.env.USER_SERVICE_URL}/${userId}/subjects/${subjectId}/add`
      );
    });
  
  });

  describe('update', () => {
    it('should update a subject and return the updated subject', async () => {
      const updateStartSubjectDto = {
        name: 'Updated Test Subject',
        shortName: 'Updated',
        description: 'Updated Description',
      };
      const updatedSubject = { _id: 'subject-id', ...updateStartSubjectDto };
      mockSubjectModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(updatedSubject),
      });

      const result = await service.update('subject-id', updateStartSubjectDto);

      expect(result).toEqual(updatedSubject);
      expect(mockSubjectModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'subject-id',
        updateStartSubjectDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if subject does not exist', async () => {
      mockSubjectModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('invalid-subject-id', {
          name: '',
          description: '',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addJourneyToSubject', () => {
    it('should throw NotFoundException if subject does not exist', async () => {
      mockSubjectModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addJourneyToSubject('invalid-subject-id', 'journey-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getJourneysBySubjectId', () => {
    it('should return an array of journey IDs associated with a subject', async () => {
      const subject = {
        _id: 'subject-id',
        name: 'Test Subject',
        journeys: ['journey-id'],
      };
      mockSubjectModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(subject),
      });

      const result = await service.getJourneysBySubjectId('subject-id');

      expect(result).toEqual(['journey-id']);
      expect(mockSubjectModel.findById).toHaveBeenCalledWith('subject-id');
    });

    it('should throw NotFoundException if subject does not exist', async () => {
      mockSubjectModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.getJourneysBySubjectId('invalid-subject-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of subjects', async () => {
      const subjects = [{ name: 'Test Subject', description: 'Description' }];
      mockSubjectModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(subjects),
      });

      const result = await service.findAll();
      expect(result).toEqual(subjects);
      expect(mockSubjectModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a subject by id', async () => {
      const subject = {
        _id: 'subject-id',
        name: 'Test Subject',
        description: 'Description',
      };
      mockSubjectModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(subject),
      });

      const result = await service.findById('subject-id');
      expect(result).toEqual(subject);
      expect(mockSubjectModel.findById).toHaveBeenCalledWith('subject-id');
    });

    it('should throw NotFoundException if subject does not exist', async () => {
      mockSubjectModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('invalid-subject-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a subject and return it', async () => {
      const subject = {
        _id: 'subject-id',
        name: 'Test Subject',
        description: 'Description',
      };
      mockSubjectModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(subject),
      });

      const result = await service.delete('subject-id');
      expect(result).toEqual(subject);
      expect(mockSubjectModel.findByIdAndDelete).toHaveBeenCalledWith('subject-id');
    });

    it('should throw NotFoundException if subject does not exist', async () => {
      mockSubjectModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('invalid-subject-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validateTokenAndGetUserId', () => {
    it('should return userId if token is valid', async () => {
      const token = 'valid-token';
      mockHttpService.get.mockReturnValue(
        of({ data: { userPayload: { id: 'valid-user-id' } } }),
      );

      const userId = await service.validateTokenAndGetUserId(token);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        `${process.env.AUTH_SERVICE_URL}/validate-token`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      expect(userId).toBe('valid-user-id');
    });

    it('should return null if token is invalid', async () => {
      const token = 'invalid-token';
      mockHttpService.get.mockReturnValue(of({ data: {} }));

      const userId = await service.validateTokenAndGetUserId(token);

      expect(userId).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return an array of subjects for the given userId', async () => {
      const subjects = [
        { _id: 'subject-id-1', name: 'Subject 1', user: 'user-id' },
        { _id: 'subject-id-2', name: 'Subject 2', user: 'user-id' },
      ];
      mockSubjectModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(subjects),
      });

      const result = await service.findByUserId('user-id');

      expect(result).toEqual(subjects);
      expect(mockSubjectModel.find).toHaveBeenCalledWith({ user: 'user-id' });
    });
  });

  describe('addJourneyToSubject', () => {
    it('should add a journey to the subject and return the updated subject', async () => {
      const subjectId = new Types.ObjectId().toHexString(); // Use um ID válido para o ponto
      const journeyId = new Types.ObjectId().toHexString(); // Use um ID válido para a jornada
      const objectId = new Types.ObjectId(journeyId);

      const subject = {
        _id: subjectId,
        name: 'Test Subject',
        journeys: [],
        save: jest.fn().mockResolvedValue({
          _id: subjectId,
          name: 'Test Subject',
          journeys: [objectId],
        }),
      };

      mockSubjectModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(subject),
      });

      const result = await service.addJourneyToSubject(subjectId, journeyId);

      expect(result).toEqual({
        _id: subjectId,
        name: 'Test Subject',
        journeys: [objectId],
      });
      expect(mockSubjectModel.findById).toHaveBeenCalledWith(subjectId);
      expect(subject.journeys).toContainEqual(objectId); // Use toContainEqual aqui
      expect(subject.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if subject does not exist', async () => {
      const subjectId = new Types.ObjectId().toHexString(); // Use um ID válido para o ponto
      const journeyId = new Types.ObjectId().toHexString(); // Use um ID válido para a jornada

      mockSubjectModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.addJourneyToSubject(subjectId, journeyId),
      ).rejects.toThrow(NotFoundException);
      expect(mockSubjectModel.findById).toHaveBeenCalledWith(subjectId);
    });
  });

  describe('updateOrder', () => {
    it('should perform bulk updates and return the result', async () => {
      const id1 = new Types.ObjectId();
      const id2 = new Types.ObjectId();

      const journeys: UpdateSubjectOrderInterface[] = [
        {
          _id: id1.toHexString(),
          order: 1,
          name: 'Subject A',
          shortName: 'Pt A',
          __v: 0,
          createdAt: '',
          updatedAt: '',
        },
        {
          _id: id2.toHexString(),
          order: 2,
          name: 'Subject B',
          shortName: 'Pt B',
          __v: 0,
          createdAt: '',
          updatedAt: '',
        },
      ];

      const bulkOperations = journeys.map((trail) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(trail._id) },
          update: { $set: { order: trail.order } },
        },
      }));

      const result = { modifiedCount: 2, matchedCount: 2 };
      mockSubjectModel.bulkWrite.mockResolvedValue(result);

      const response = await service.updateOrder(journeys);

      expect(mockSubjectModel.bulkWrite).toHaveBeenCalledWith(bulkOperations);
      expect(response).toEqual(result);
    });
  });
});
